import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {shippingAddressApi} from "./shippingAddressApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("shippingAddressApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getShippingAddresses requests /shipping-addresses", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/shipping-addresses");

            return new Response(
                JSON.stringify([
                    {
                        id: "a1",
                        streetAddress: "Main St",
                        city: "Kyiv",
                        numberOfApartment: "1",
                        zipCode: "01001",
                        isDefault: true,
                        latitude: 50.45,
                        longitude: 30.52,
                    },
                ]),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            shippingAddressApi.endpoints.getShippingAddresses.initiate(),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.[0]?.id).toBe("a1");
    });

    test("getDefaultShippingAddress requests /shipping-addresses/default", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/shipping-addresses/default");

            return new Response(
                JSON.stringify({
                    id: "a1",
                    streetAddress: "Main St",
                    city: "Kyiv",
                    numberOfApartment: "1",
                    zipCode: "01001",
                    isDefault: true,
                    latitude: 50.45,
                    longitude: 30.52,
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            shippingAddressApi.endpoints.getDefaultShippingAddress.initiate(),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.id).toBe("a1");
    });
});
