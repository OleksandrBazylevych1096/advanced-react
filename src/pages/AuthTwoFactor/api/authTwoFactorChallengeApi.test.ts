import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {applyAuthSession} from "@/entities/user";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {authTwoFactorChallengeApi} from "./authTwoFactorChallengeApi";

vi.mock("@/entities/user", () => ({
    applyAuthSession: vi.fn(),
}));

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("authTwoFactorChallengeApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("verifyTwoFactor sends POST /auth/2fa/verify and applies auth session", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/2fa/verify");

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
            authTwoFactorChallengeApi.endpoints.verifyTwoFactor.initiate({
                mfaToken: "mfa-1",
                method: "totp",
                code: "123456",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(applyAuthSession).toHaveBeenCalledTimes(1);
    });

    test("sendLoginOtp sends POST /auth/otp/send", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/otp/send");

            return new Response(JSON.stringify({success: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            authTwoFactorChallengeApi.endpoints.sendLoginOtp.initiate({
                purpose: "login_2fa",
                mfaToken: "mfa-1",
                channel: "email",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({success: true});
    });

    test("verifyLoginOtp sends POST /auth/otp/verify and applies auth session", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/otp/verify");

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
            authTwoFactorChallengeApi.endpoints.verifyLoginOtp.initiate({
                purpose: "login_2fa",
                mfaToken: "mfa-1",
                channel: "sms",
                code: "1234",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(applyAuthSession).toHaveBeenCalledTimes(1);
    });
});
