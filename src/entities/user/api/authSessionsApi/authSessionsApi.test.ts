import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl, parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {authSessionsApi} from "./authSessionsApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("authSessionsApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getAuthSessions calls GET /auth/sessions", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/auth/sessions");

            return new Response(JSON.stringify([{id: "s1", userId: "u1", isActive: true}]), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(authSessionsApi.endpoints.getAuthSessions.initiate());

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual([{id: "s1", userId: "u1", isActive: true}]);
    });

    test("revokeAuthSession calls DELETE /auth/sessions/:id", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod = input instanceof Request ? input.method : (init?.method ?? "GET");
            expect(requestUrl).toContain("/auth/sessions/s-1");
            expect(requestMethod).toBe("DELETE");

            return new Response(JSON.stringify({success: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            authSessionsApi.endpoints.revokeAuthSession.initiate("s-1"),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({success: true});
    });

    test("revokeAllAuthSessions sends includeCurrent query param", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod = input instanceof Request ? input.method : (init?.method ?? "GET");
            const url = parseRequestUrl(requestUrl);

            expect(url.pathname).toContain("/auth/sessions");
            expect(url.searchParams.get("includeCurrent")).toBe("true");
            expect(requestMethod).toBe("DELETE");

            return new Response(JSON.stringify({success: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            authSessionsApi.endpoints.revokeAllAuthSessions.initiate({includeCurrent: true}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({success: true});
    });
});
