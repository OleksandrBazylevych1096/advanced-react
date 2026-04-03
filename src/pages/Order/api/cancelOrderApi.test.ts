import {configureStore} from "@reduxjs/toolkit";
import {describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {cancelOrderApi} from "./cancelOrderApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("cancelOrderApi", () => {
    test("posts /orders/:id/cancel endpoint", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod = input instanceof Request ? input.method : (init?.method ?? "GET");

            expect(requestMethod).toBe("POST");
            expect(requestUrl).toContain("/orders/order-1/cancel");

            return new Response(JSON.stringify({ok: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            cancelOrderApi.endpoints.cancelOrder.initiate({id: "order-1"}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({ok: true});
    });
});
