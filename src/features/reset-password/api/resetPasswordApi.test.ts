import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {resetPasswordApi} from "./resetPasswordApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("resetPasswordApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("resetPassword sends POST /auth/reset-password", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/reset-password");

            return new Response(JSON.stringify({success: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            resetPasswordApi.endpoints.resetPassword.initiate({
                token: "token-1",
                newPassword: "StrongPassword123!",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({success: true});
    });
});
