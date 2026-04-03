import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {updateCartItemApi} from "./updateCartItemApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("updateCartItemApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("uses PATCH when quantity is positive", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/cart/item/product-1");
            expect(init?.method).toBe("PATCH");
            expect(JSON.parse(String(init?.body))).toEqual({quantity: 3});

            return new Response(null, {status: 204});
        });

        const store = createApiStore();
        await store.dispatch(
            updateCartItemApi.endpoints.updateCartItem.initiate({
                productId: "product-1",
                quantity: 3,
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test("uses DELETE when quantity is zero or less", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/cart/item/product-1");
            expect(init?.method).toBe("DELETE");

            return new Response(null, {status: 204});
        });

        const store = createApiStore();
        await store.dispatch(
            updateCartItemApi.endpoints.updateCartItem.initiate({
                productId: "product-1",
                quantity: 0,
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});
