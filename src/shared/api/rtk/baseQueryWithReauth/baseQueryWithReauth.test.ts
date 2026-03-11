import {beforeEach, describe, expect, test, vi} from "vitest";

import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {baseQueryWithReauth, configureBaseQueryWithReauth} from "./baseQueryWithReauth";

type TestApi = Parameters<typeof baseQueryWithReauth>[1];

const buildApi = ({
    dispatch = vi.fn(),
    state = {} as StateSchema,
}: {
    dispatch?: TestApi["dispatch"];
    state?: StateSchema;
} = {}): TestApi => ({
    signal: new AbortController().signal,
    abort: vi.fn(),
    dispatch,
    getState: () => state,
    extra: undefined,
    endpoint: "testEndpoint",
    type: "query",
    forced: false,
});

describe("baseQueryWithReauth", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("adds Authorization header when access token exists", async () => {
        configureBaseQueryWithReauth({
            selectAccessToken: () => "token-123",
            applyAuthSession: vi.fn(),
            clearUserSession: vi.fn(),
        });

        const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const headers =
                input instanceof Request
                    ? input.headers
                    : init?.headers instanceof Headers
                      ? init.headers
                      : new Headers(init?.headers as HeadersInit);

            expect(getRequestUrl(input)).toContain("/products");
            expect(headers.get("Authorization")).toBe("Bearer token-123");

            return new Response(JSON.stringify({ok: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const result = await baseQueryWithReauth("/products", buildApi(), {});

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({data: {ok: true}});
    });

    test("retries protected request after successful refresh", async () => {
        const applyAuthSession = vi.fn();
        const clearUserSession = vi.fn();
        const dispatch = vi.fn();

        configureBaseQueryWithReauth({
            selectAccessToken: () => "expired-token",
            applyAuthSession,
            clearUserSession,
        });

        let secureCalls = 0;
        vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = getRequestUrl(input);

            if (url.includes("/auth/refresh")) {
                return new Response(
                    JSON.stringify({
                        accessToken: "new-token",
                        accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                        user: {id: "u1", provider: "local"},
                    }),
                    {
                        status: 200,
                        headers: {"Content-Type": "application/json"},
                    },
                );
            }

            secureCalls += 1;
            if (secureCalls === 1) {
                return new Response(JSON.stringify({message: "Unauthorized"}), {
                    status: 401,
                    headers: {"Content-Type": "application/json"},
                });
            }

            return new Response(JSON.stringify({ok: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const result = await baseQueryWithReauth("/cart", buildApi({dispatch}), {});

        expect(applyAuthSession).toHaveBeenCalledTimes(1);
        expect(clearUserSession).not.toHaveBeenCalled();
        expect(result).toMatchObject({data: {ok: true}});
    });

    test("does not refresh for auth endpoints", async () => {
        configureBaseQueryWithReauth({
            selectAccessToken: () => "expired-token",
            applyAuthSession: vi.fn(),
            clearUserSession: vi.fn(),
        });

        const fetchMock = vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({message: "Unauthorized"}), {
                status: 401,
                headers: {"Content-Type": "application/json"},
            });
        });

        const result = await baseQueryWithReauth("/auth/login", buildApi(), {});

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({error: {status: 401}});
    });

    test("clears session when refresh fails", async () => {
        const clearUserSession = vi.fn();
        configureBaseQueryWithReauth({
            selectAccessToken: () => "expired-token",
            applyAuthSession: vi.fn(),
            clearUserSession,
        });

        vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = getRequestUrl(input);

            if (url.includes("/auth/refresh")) {
                return new Response(JSON.stringify({message: "Refresh failed"}), {
                    status: 401,
                    headers: {"Content-Type": "application/json"},
                });
            }

            return new Response(JSON.stringify({message: "Unauthorized"}), {
                status: 401,
                headers: {"Content-Type": "application/json"},
            });
        });

        const result = await baseQueryWithReauth("/orders", buildApi(), {});

        expect(clearUserSession).toHaveBeenCalledTimes(1);
        expect(result).toMatchObject({error: {status: 401}});
    });
});
