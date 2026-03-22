import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {setupTwoFactorApi} from "./setupTwoFactorApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("setupTwoFactorApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("setupTwoFactor sends POST /auth/2fa/setup", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/2fa/setup");

            return new Response(
                JSON.stringify({
                    qrCodeDataUrl: "data:image/png;base64,abc",
                    backupCodes: ["AAA111", "BBB222"],
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(setupTwoFactorApi.endpoints.setupTwoFactor.initiate());

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            qrCodeDataUrl: "data:image/png;base64,abc",
            backupCodes: ["AAA111", "BBB222"],
        });
    });

    test("enableTwoFactor sends POST /auth/2fa/enable", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/auth/2fa/enable");

            return new Response(JSON.stringify({success: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            setupTwoFactorApi.endpoints.enableTwoFactor.initiate({code: "123456"}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({success: true});
    });
});
