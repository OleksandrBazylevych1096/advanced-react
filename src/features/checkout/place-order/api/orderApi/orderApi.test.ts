import {configureStore} from "@reduxjs/toolkit";
import {describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl.ts";

import {orderApi} from "./orderApi.ts";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("orderApi", () => {
    test("getOrderById requests /orders/:id", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/orders/order-1");
            expect(requestUrl).toContain("locale=en");

            return new Response(
                JSON.stringify({
                    id: "order-1",
                    orderNumber: "#1001",
                    paymentStatus: "PENDING",
                    status: "PENDING",
                    totalAmount: 100,
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            orderApi.endpoints.getOrderById.initiate({
                orderId: "order-1",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.id).toBe("order-1");
    });
});
