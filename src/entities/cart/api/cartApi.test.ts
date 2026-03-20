import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {cartApi} from "./cartApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("cartApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getCart requests /cart and returns cart payload", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/cart");
            expect(requestUrl).toContain("locale=en");
            expect(requestUrl).toContain("currency=USD");

            return new Response(
                JSON.stringify({
                    items: [],
                    totals: {
                        subtotal: 0,
                        totalItems: 0,
                        estimatedShipping: 0,
                        estimatedTax: 0,
                        total: 0,
                    },
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            cartApi.endpoints.getCart.initiate({locale: "en", currency: "USD"}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            items: [],
            totals: {
                subtotal: 0,
                totalItems: 0,
                estimatedShipping: 0,
                estimatedTax: 0,
                total: 0,
            },
        });
    });

    test("getCartCount requests /cart/count", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/cart/count");
            expect(requestUrl).toContain("locale=en");
            expect(requestUrl).toContain("currency=USD");

            return new Response(JSON.stringify(3), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            cartApi.endpoints.getCartCount.initiate({locale: "en", currency: "USD"}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toBe(3);
    });

    test("syncCart posts guest cart items to /cart/sync", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod = input instanceof Request ? input.method : (init?.method ?? "GET");

            expect(requestUrl).toContain("/cart/sync");
            expect(requestUrl).toContain("locale=en");
            expect(requestUrl).toContain("currency=USD");
            expect(requestMethod).toBe("POST");

            return new Response(JSON.stringify({items: [], totals: {totalItems: 0}}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        await store.dispatch(
            cartApi.endpoints.syncCart.initiate({
                guestCartItems: [{productId: "p1", quantity: 2}],
                locale: "en",
                currency: "USD",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});
