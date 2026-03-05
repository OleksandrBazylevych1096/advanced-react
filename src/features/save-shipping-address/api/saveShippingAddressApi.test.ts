import {beforeEach, describe, expect, test, vi} from "vitest";

import {createStore} from "@/app/store";

import {saveShippingAddressApi} from "./saveShippingAddressApi";

describe("saveShippingAddressApi", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("searchAddresses sends default limit and locale query params", async () => {
        const store = createStore();
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = typeof input === "string" ? input : input.url;

            expect(requestUrl).toContain("/shipping-addresses/search");

            const url = new URL(requestUrl, "http://localhost");
            expect(url.searchParams.get("searchQuery")).toBe("Main St, London");
            expect(url.searchParams.get("locale")).toBe("en");
            expect(url.searchParams.get("limit")).toBe("5");

            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const result = await store.dispatch(
            saveShippingAddressApi.endpoints.searchAddresses.initiate({
                searchQuery: "Main St, London",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual([]);
    });

    test("getReverseGeocode maps tuple coords to lat/lon params", async () => {
        const store = createStore();
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = typeof input === "string" ? input : input.url;

            expect(requestUrl).toContain("/shipping-addresses/reverse-geocode");

            const url = new URL(requestUrl, "http://localhost");
            expect(url.searchParams.get("lat")).toBe("50.45");
            expect(url.searchParams.get("lon")).toBe("30.52");
            expect(url.searchParams.get("locale")).toBe("uk");

            return new Response(
                JSON.stringify({
                    label: "Kyiv",
                    country: "Ukraine",
                    city: "Kyiv",
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const result = await store.dispatch(
            saveShippingAddressApi.endpoints.getReverseGeocode.initiate({
                coords: [50.45, 30.52],
                locale: "uk",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.label).toBe("Kyiv");
    });
});
