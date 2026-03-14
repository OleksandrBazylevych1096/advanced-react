import type {LatLngTuple} from "leaflet";

import type {
    AddressSearchResult,
    CreateShippingAddress,
    ReverseGeocodeResult,
    ShippingAddress,
    UpdateShippingAddress,
} from "@/entities/shipping-address";

import {baseAPI, type ApiLocaleParams} from "@/shared/api";

interface SearchAddressesParams extends ApiLocaleParams {
    searchQuery: string;
    limit?: number;
}

interface ReverseGeocodeParams extends ApiLocaleParams {
    coords: LatLngTuple;
}

export const saveShippingAddressApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        searchAddresses: build.query<AddressSearchResult[], SearchAddressesParams>({
            query: ({searchQuery, limit = 5, locale}) => ({
                url: "/shipping-addresses/search",
                params: {searchQuery, limit, locale},
            }),
        }),
        getReverseGeocode: build.query<ReverseGeocodeResult, ReverseGeocodeParams>({
            query: ({coords, locale}) => ({
                url: "/shipping-addresses/reverse-geocode",
                params: {
                    lat: coords[0],
                    lon: coords[1],
                    locale,
                },
            }),
        }),
        createShippingAddress: build.mutation<ShippingAddress, CreateShippingAddress>({
            query: (body) => ({
                url: "/shipping-addresses",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ShippingAddress"],
        }),
        editShippingAddress: build.mutation<
            ShippingAddress,
            {body: UpdateShippingAddress; id: string}
        >({
            query: ({body, id}) => ({
                url: `/shipping-addresses/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["ShippingAddress"],
        }),
    }),
});

export const {
    useSearchAddressesQuery,
    useGetReverseGeocodeQuery,
    useCreateShippingAddressMutation,
    useEditShippingAddressMutation,
} = saveShippingAddressApi;
