import type {LatLngTuple} from "leaflet";

import {baseAPI} from "@/shared/api/rtk/baseAPI";

import type {
    AddressSearchResult,
    CreateShippingAddress,
    ReverseGeocodeResult,
    ShippingAddress,
    UpdateShippingAddress,
} from "@/entities/shipping-address";

export const saveShippingAddressApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        searchAddresses: build.query<
            AddressSearchResult[],
            {searchQuery: string; limit?: number; locale: string}
        >({
            query: ({searchQuery, limit = 5, locale}) => ({
                url: "/shipping-addresses/search",
                params: {searchQuery, limit, locale},
            }),
        }),
        getReverseGeocode: build.query<ReverseGeocodeResult, {coords: LatLngTuple; locale: string}>(
            {
                query: ({coords, locale}) => ({
                    url: "/shipping-addresses/reverse-geocode",
                    params: {
                        lat: coords[0],
                        lon: coords[1],
                        locale,
                    },
                }),
            },
        ),
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
