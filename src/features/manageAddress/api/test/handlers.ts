import {delay, http, HttpResponse} from 'msw';

import {API_URL} from '@/shared/config';
import {createHandlers, extendHandlers} from "@/shared/lib/test/msw/createHandlers.ts";

import {
    mockAddresses,
    mockCitySuggestions,
    mockGeocodeLondon,
    mockSingleAddress,
    mockStreetSuggestions,
} from './mockData.ts';

const BASE_URL = `${API_URL}/shipping-addresses`;

const geocodeBase = createHandlers({
    endpoint: `${BASE_URL}/reverse-geocode`,
    method: 'get',
    defaultData: mockGeocodeLondon,
    errorData: {error: 'Failed to fetch geocode'},
    errorStatus: 500,
});

export const geocodeHandlers = extendHandlers(geocodeBase, {
    withDelay: http.get(`${BASE_URL}/reverse-geocode`, async () => {
        await delay(500);
        return HttpResponse.json(mockGeocodeLondon);
    }),
});

// Search address handlers
const searchBase = createHandlers({
    endpoint: `${BASE_URL}/search`,
    method: 'get',
    defaultData: mockStreetSuggestions,
    errorData: {error: 'Failed to fetch suggestions'},
    errorStatus: 500,
});

export const searchHandlers = extendHandlers(searchBase, {
    withQuery: http.get(`${BASE_URL}/search`, async ({request}) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('searchQuery') || '';
        await delay(100);
        if (query.toLowerCase().includes('street') || query.toLowerCase().includes('baker')) {
            return HttpResponse.json(mockStreetSuggestions);
        }
        return HttpResponse.json(mockCitySuggestions);
    }),

    empty: http.get(`${BASE_URL}/search`, async () => {
        await delay(100);
        return HttpResponse.json([]);
    }),
});

// Create address handlers
export const createAddressHandlers = extendHandlers(
    createHandlers({
        endpoint: BASE_URL,
        method: 'post',
        defaultData: {...mockSingleAddress, id: 'new-address-123'},
        errorData: {error: 'Failed to create address'},
        errorStatus: 500,
    }),
    {}
);

export const updateAddressHandlers = extendHandlers(
    createHandlers({
        endpoint: `${BASE_URL}/:id`,
        method: 'patch',
        defaultData: mockSingleAddress,
        errorData: {error: 'Failed to update address'},
        errorStatus: 500,
    }),
    {}
);

export const deleteAddressHandlers = extendHandlers(
    createHandlers({
        endpoint: `${BASE_URL}/:id`,
        method: 'delete',
        defaultData: mockAddresses.slice(1),
        errorData: {error: 'Failed to delete address'},
        errorStatus: 500,
    }),
    {}
);

export const setDefaultAddressHandlers = extendHandlers(
    createHandlers({
        endpoint: `${BASE_URL}/:id/set-default`,
        method: 'patch',
        defaultData: {},
        errorData: {error: 'Failed to set default address'},
        errorStatus: 500,
    }),
    {}
);

const listBase = createHandlers({
    endpoint: BASE_URL,
    method: 'get',
    defaultData: mockAddresses,
    errorData: {error: 'Failed to load addresses'},
    errorStatus: 500,
});

export const listAddressHandlers = extendHandlers(listBase, {
    single: http.get(BASE_URL, () => {
        return HttpResponse.json([mockSingleAddress]);
    }),

    empty: http.get(BASE_URL, () => {
        return HttpResponse.json([]);
    }),
});

const defaultAddressBase = createHandlers({
    endpoint: `${BASE_URL}/default`,
    method: 'get',
    defaultData: mockSingleAddress,
    errorData: {error: 'Failed to load default address'},
    errorStatus: 500,
});

export const defaultAddressHandlers = extendHandlers(defaultAddressBase, {
    noDefault: http.get(`${BASE_URL}/default`, () => {
        return HttpResponse.json(null);
    }),
});


export const manageAddressHandlers = {
    list: listAddressHandlers,
    defaultAddress: defaultAddressHandlers,
    search: searchHandlers,
    geocode: geocodeHandlers,
    create: createAddressHandlers,
    update: updateAddressHandlers,
    delete: deleteAddressHandlers,
    setDefault: setDefaultAddressHandlers,
};

export const handlers = {
    geocodeSuccessLondon: geocodeHandlers.default,
    geocodeLoading: geocodeHandlers.loading,
    geocodeError: geocodeHandlers.error,

    searchSuccess: searchHandlers.default,
    searchLoading: searchHandlers.loading,
    searchError: searchHandlers.error,
    searchEmpty: searchHandlers.empty,

    createSuccess: createAddressHandlers.default,
    createLoading: createAddressHandlers.loading,
    createError: createAddressHandlers.error,

    updateSuccess: updateAddressHandlers.default,
    updateLoading: updateAddressHandlers.loading,
    updateError: updateAddressHandlers.error,

    deleteSuccess: deleteAddressHandlers.default,
    deleteLoading: deleteAddressHandlers.loading,
    deleteError: deleteAddressHandlers.error,

    listSuccess: listAddressHandlers.default,
    listSingle: listAddressHandlers.single,
    listEmpty: listAddressHandlers.empty,
    listLoading: listAddressHandlers.loading,
    listError: listAddressHandlers.error,

    defaultAddressSuccess: defaultAddressHandlers.default,
    defaultAddressLoading: defaultAddressHandlers.loading,
    defaultAddressError: defaultAddressHandlers.error,
};
