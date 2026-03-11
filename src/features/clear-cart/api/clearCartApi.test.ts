import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {clearCartApi} from "./clearCartApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("clearCartApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("clearCart sends DELETE /cart/clear", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const url = parseRequestUrl(input);
            expect(url.pathname).toContain("/cart/clear");
            expect(init?.method).toBe("DELETE");

            return new Response(null, {status: 204});
        });

        const store = createApiStore();
        await store.dispatch(clearCartApi.endpoints.clearCart.initiate());

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});

