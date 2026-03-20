import {configureStore} from "@reduxjs/toolkit";
import {describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl.ts";

import {checkoutResultApi} from "./checkoutResultApi.ts";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("checkoutResultApi", () => {
    test("getCheckoutPaymentSession requests /checkout/payment-session/:id", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/checkout/payment-session/session-1");

            return new Response(
                JSON.stringify({
                    sessionId: "session-1",
                    stripePaymentIntentId: "pi_1",
                    stripeClientSecret: "cs_test_1",
                    status: "pending_payment",
                    amount: 22,
                    currency: "usd",
                    expiresAt: "2026-03-14T10:30:00.000Z",
                    order: null,
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            checkoutResultApi.endpoints.getCheckoutPaymentSession.initiate({
                sessionId: "session-1",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.sessionId).toBe("session-1");
    });

    test("confirmPaymentFallback patches /checkout/:sessionId/confirm-payment", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod = input instanceof Request ? input.method : (init?.method ?? "GET");

            expect(requestMethod).toBe("PATCH");
            expect(requestUrl).toContain("/checkout/session-1/confirm-payment");

            return new Response(null, {status: 200});
        });

        const store = createApiStore();
        const result = await store.dispatch(
            checkoutResultApi.endpoints.confirmPaymentFallback.initiate({
                sessionId: "session-1",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect("data" in result).toBe(true);
    });
});
