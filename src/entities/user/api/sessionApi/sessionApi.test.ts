import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";

import {sessionApi} from "./sessionApi";

const testCtx = vi.hoisted(() => ({
    applyAuthSessionMock: vi.fn(),
    clearUserSessionMock: vi.fn(),
}));

vi.mock("../../model/services/applyUserSession/applyUserSession", () => ({
    applyAuthSession: (...args: unknown[]) => testCtx.applyAuthSessionMock(...args),
}));

vi.mock("../../model/services/clearUserSession/clearUserSession", () => ({
    clearUserSession: (...args: unknown[]) => testCtx.clearUserSessionMock(...args),
}));

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("sessionApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("applies auth session when refresh succeeds", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(
                JSON.stringify({
                    accessToken: "token-1",
                    accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                    user: {id: "u1", provider: "LOCAL"},
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        await store.dispatch(sessionApi.endpoints.refreshSession.initiate());

        expect(testCtx.applyAuthSessionMock).toHaveBeenCalledTimes(1);
        expect(testCtx.clearUserSessionMock).not.toHaveBeenCalled();
    });

    test("clears session when refresh fails", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({message: "Unauthorized"}), {
                status: 401,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        await store.dispatch(sessionApi.endpoints.refreshSession.initiate());

        expect(testCtx.clearUserSessionMock).toHaveBeenCalledTimes(1);
    });
});
