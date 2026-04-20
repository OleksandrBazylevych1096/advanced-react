import {beforeEach, describe, expect, test, vi} from "vitest";

import {createStore, type AppDispatch} from "@/app/store/setup/store";

import {mockGeocodeLondon} from "@/entities/shipping-address/testing";

import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {saveShippingAddressApi} from "./saveShippingAddressApi";

describe("saveShippingAddressApi", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    test("searchAddresses sends default limit and locale query params", async () => {
        const store = createStore();
        const dispatch = store.dispatch as AppDispatch;
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

        const result = await dispatch(
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
        const dispatch = store.dispatch as AppDispatch;
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

        const result = await dispatch(
            saveShippingAddressApi.endpoints.getReverseGeocode.initiate({
                coords: [50.45, 30.52],
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.label).toBe(mockGeocodeLondon.label);
    });

    test("createShippingAddress posts country in request body", async () => {
        const store = createStore();
        const dispatch = store.dispatch as AppDispatch;
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const bodyText =
                input instanceof Request ? await input.clone().text() : String(init?.body ?? "{}");
            const body = JSON.parse(bodyText) as {country?: string};

            expect(body.country).toBe("GB");

            return new Response(JSON.stringify({id: "addr-1", ...body}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        await dispatch(
            saveShippingAddressApi.endpoints.createShippingAddress.initiate({
                streetAddress: "Baker Street",
                city: "London",
                country: "GB",
                numberOfApartment: "221B",
                zipCode: "NW1",
                latitude: 51.5237,
                longitude: -0.1585,
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    test("editShippingAddress patches country in request body", async () => {
        const store = createStore();
        const dispatch = store.dispatch as AppDispatch;
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const bodyText =
                input instanceof Request ? await input.clone().text() : String(init?.body ?? "{}");
            const body = JSON.parse(bodyText) as {country?: string};

            expect(body.country).toBe("UA");

            return new Response(JSON.stringify({id: "addr-1", ...body}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        await dispatch(
            saveShippingAddressApi.endpoints.editShippingAddress.initiate({
                id: "addr-1",
                body: {
                    city: "Kyiv",
                    country: "UA",
                },
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
});
