import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {applyAuthSession} from "@/entities/user";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {registerApi} from "./registerApi";

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

describe("registerApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("register sends POST /auth/register", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/register");

            return new Response(JSON.stringify({verificationRequired: "email"}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            registerApi.endpoints.register.initiate({
                email: "john@example.com",
                password: "StrongPassword123!",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({verificationRequired: "email"});
    });

    test("sendRegistrationOtp sends POST /auth/otp/send", async () => {
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
            registerApi.endpoints.sendRegistrationOtp.initiate({
                purpose: "registration_email_verify",
                identifier: "john@example.com",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({success: true});
    });

    test("verifyRegistrationOtp sends POST /auth/otp/verify and applies auth session", async () => {
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
        const result = await store.dispatch(
            registerApi.endpoints.verifyRegistrationOtp.initiate({
                purpose: "registration_email_verify",
                identifier: "john@example.com",
                code: "1234",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            accessToken: "token-1",
            accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
            user: {id: "u1", provider: "LOCAL"},
        });
        expect(applyAuthSession).toHaveBeenCalledTimes(1);
    });
});
