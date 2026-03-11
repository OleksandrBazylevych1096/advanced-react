import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {addToCartApi} from "./addToCartApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("addToCartApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("addToCart sends POST /cart/add with product and quantity", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/cart/add");
            expect(init?.method).toBe("POST");
            expect(JSON.parse(String(init?.body))).toEqual({
                productId: "product-1",
                quantity: 2,
            });

            return new Response(JSON.stringify({items: []}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        await store.dispatch(
            addToCartApi.endpoints.addToCart.initiate({
                productId: "product-1",
                quantity: 2,
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});

