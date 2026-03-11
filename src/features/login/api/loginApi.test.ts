import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";

import {loginApi} from "./loginApi";

const testCtx = vi.hoisted(() => ({
    applyAuthSessionMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
    applyAuthSession: (...args: unknown[]) => testCtx.applyAuthSessionMock(...args),
}));

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("loginApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("applies auth session when login returns full auth payload", async () => {
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
        await store.dispatch(
            loginApi.endpoints.login.initiate({
                identifier: "john@example.com",
                password: "password",
            }),
        );

        expect(testCtx.applyAuthSessionMock).toHaveBeenCalledTimes(1);
    });

    test("does not apply auth session for MFA challenge response", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(
                JSON.stringify({
                    requiresTwoFactor: true,
                    mfaToken: "mfa-token",
                    mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        await store.dispatch(
            loginApi.endpoints.login.initiate({
                identifier: "john@example.com",
                password: "password",
            }),
        );

        expect(testCtx.applyAuthSessionMock).not.toHaveBeenCalled();
    });
});

