import {delay, http, HttpResponse} from "msw";

import {
    mockAddresses,
    mockCitySuggestions,
    mockGeocodeLondon,
    mockSingleAddress,
    mockStreetSuggestions
} from "@/features/manageAddress/lib/test/mockData.ts";

import {API_URL} from "@/shared/config";

const BASE_URL = `${API_URL}/shipping-addresses`;

export const handlers = {
    geocodeSuccessLondon: http.get(`${BASE_URL}/reverse-geocode`, async () => {
        await delay(500);
        return HttpResponse.json(mockGeocodeLondon);
    }),

    geocodeLoading: http.get(`${BASE_URL}/reverse-geocode`, async () => {
        await delay('infinite');
        return HttpResponse.json(mockGeocodeLondon);
    }),

    geocodeError: http.get(`${BASE_URL}/reverse-geocode`, async () => {
        await delay(500);
        return HttpResponse.json(
            {error: "Failed to fetch geocode"},
            {status: 500}
        );
    }),

    searchSuccess: http.get(`${BASE_URL}/search`, async ({request}) => {
        const url = new URL(request.url);
        const query = url.searchParams.get("searchQuery") || "";
        await delay(300);
        if (query.toLowerCase().includes("street") || query.toLowerCase().includes("baker")) {
            return HttpResponse.json(mockStreetSuggestions);
        }
        return HttpResponse.json(mockCitySuggestions);
    }),

    searchLoading: http.get(`${BASE_URL}/search`, async () => {
        await delay('infinite');
        return HttpResponse.json(mockStreetSuggestions);
    }),

    searchError: http.get(`${BASE_URL}/search`, async () => {
        await delay(500);
        return HttpResponse.json(
            {error: "Failed to fetch suggestions"},
            {status: 500}
        );
    }),

    searchEmpty: http.get(`${BASE_URL}/search`, async () => {
        await delay(300);
        return HttpResponse.json([]);
    }),

    searchMany: http.get(`${BASE_URL}/search`, async () => {
        await delay(300);
        const suggestions = Array.from({length: 10}, (_, i) => ({
            displayName: `Main Street ${i + 1}, London, UK`,
            lat: 51.5074 + i * 0.01,
            lon: -0.1278 + i * 0.01,
            address: {
                road: `Main Street ${i + 1}`,
                city: "London",
                country: "United Kingdom"
            }
        }));
        return HttpResponse.json(suggestions);
    }),
    createSuccess: http.post(BASE_URL, async () => {
        await delay(500);
        return HttpResponse.json({id: "123", success: true});
    }),

    createLoading: http.post(BASE_URL, async () => {
        await delay('infinite');
        return HttpResponse.json({id: "123", success: true});
    }),

    createError: http.post(BASE_URL, async () => {
        await delay(500);
        return HttpResponse.json(
            {error: "Failed to create address"},
            {status: 500}
        );
    }),


    updateSuccess: http.put(`${BASE_URL}/:id`, async () => {
        await delay(500);
        return HttpResponse.json({success: true});
    }),

    updateLoading: http.put(`${BASE_URL}/:id`, async () => {
        await delay('infinite');
        return HttpResponse.json({success: true});
    }),

    updateError: http.put(`${BASE_URL}/:id`, async () => {
        await delay(500);
        return HttpResponse.json(
            {error: "Failed to update address"},
            {status: 500}
        );
    }),

    listSuccess: http.get(BASE_URL, () => {
        return HttpResponse.json(mockAddresses);
    }),

    listSingle: http.get(BASE_URL, () => {
        return HttpResponse.json([mockSingleAddress]);
    }),

    listEmpty: http.get(BASE_URL, () => {
        return HttpResponse.json([]);
    }),

    listLoading: http.get(BASE_URL, async () => {
        await delay('infinite');
        return HttpResponse.json(mockAddresses);
    }),

    listError: http.get(BASE_URL, () => {
        return HttpResponse.json(
            {error: "Failed to load addresses"},
            {status: 500}
        );
    }),

    listMany: http.get(BASE_URL, async () => {
        const manyAddresses = Array.from({length: 10}, (_, i) => ({
            id: `address-${i + 1}`,
            label: `${i + 1} Main Street, London, WC2N ${i}DN`,
            name: `Address ${i + 1}`,
            street: "Main Street",
            housenumber: `${i + 1}`,
            city: "London",
            postcode: `WC2N ${i}DN`,
            country: "United Kingdom",
            lat: 51.5074 + i * 0.01,
            lon: -0.1278 + i * 0.01,
            isDefault: i === 0,
        }));
        return HttpResponse.json(manyAddresses);
    }),

}

