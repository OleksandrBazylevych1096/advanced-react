import {configureStore} from "@reduxjs/toolkit";
import {describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl.ts";

import {checkoutApi} from "./checkoutApi.ts";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("checkoutApi", () => {
    test("getCheckoutSummary requests /checkout/summary", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/checkout/summary");
            expect(requestUrl).toContain("locale=en");
            expect(requestUrl).toContain("currency=USD");

            return new Response(
                JSON.stringify({
                    items: [],
                    totals: {
                        subtotal: 0,
                        freeShippingTarget: 0,
                        totalItems: 0,
                        estimatedShipping: 0,
                        estimatedTax: 0,
                        total: 0,
                    },
                    validation: [],
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            checkoutApi.endpoints.getCheckoutSummary.initiate({locale: "en", currency: "USD"}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toBeDefined();
    });

    test("createPaymentSession posts /checkout/payment-session", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod = input instanceof Request ? input.method : (init?.method ?? "GET");

            expect(requestMethod).toBe("POST");
            expect(requestUrl).toContain("/checkout/payment-session");

            const bodyText =
                input instanceof Request ? await input.clone().text() : String(init?.body ?? "{}");
            const body = JSON.parse(bodyText) as {
                paymentMethod: string;
                currency?: string;
                locale?: string;
            };

            expect(body.paymentMethod).toBe("stripe");
            expect(body.currency).toBe("usd");
            expect(body.locale).toBe("de");

            return new Response(
                JSON.stringify({
                    sessionId: "session-1",
                    stripePaymentIntentId: "pi_1",
                    stripeClientSecret: "cs_test_1",
                    status: "pending_payment",
                    amount: 22,
                    currency: "usd",
                    expiresAt: "2026-03-14T10:30:00.000Z",
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            checkoutApi.endpoints.createPaymentSession.initiate({
                shippingAddress: "Main",
                shippingCity: "Boston",
                shippingCountry: "US",
                shippingPostal: "02118",
                billingAddress: "Main",
                billingCity: "Boston",
                billingCountry: "US",
                billingPostal: "02118",
                paymentMethod: "stripe",
                locale: "de",
                currency: "usd",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.sessionId).toBe("session-1");
    });
});
