import {beforeEach, describe, expect, test, vi} from "vitest";

import {createStore} from "@/app/store/setup/store";

import {mockGeocodeLondon} from "@/entities/shipping-address/api/test/mockData";

import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {saveShippingAddressApi} from "./saveShippingAddressApi";

describe("saveShippingAddressApi", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("searchAddresses sends default limit and locale query params", async () => {
        const store = createStore();
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = parseRequestUrl(input);

            expect(requestUrl.toString()).toContain("/shipping-addresses/search");
            expect(requestUrl.searchParams.get("searchQuery")).toBe("Main St, London");
            expect(requestUrl.searchParams.get("locale")).toBe("en");
            expect(requestUrl.searchParams.get("limit")).toBe("5");

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
            const requestUrl = parseRequestUrl(input);

            expect(requestUrl.toString()).toContain("/shipping-addresses/reverse-geocode");
            expect(requestUrl.searchParams.get("lat")).toBe("50.45");
            expect(requestUrl.searchParams.get("lon")).toBe("30.52");
            expect(requestUrl.searchParams.get("locale")).toBe("en");

            return new Response(JSON.stringify(mockGeocodeLondon), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const result = await store.dispatch(
            saveShippingAddressApi.endpoints.getReverseGeocode.initiate({
                coords: [50.45, 30.52],
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.label).toBe(mockGeocodeLondon.label);
    });
});
