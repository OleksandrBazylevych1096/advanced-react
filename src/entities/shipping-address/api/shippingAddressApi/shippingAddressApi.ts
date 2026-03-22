import {baseAPI} from "@/shared/api";

import type {ShippingAddress} from "../../model/types/types";

export const shippingAddressApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getShippingAddresses: build.query<ShippingAddress[], void>({
            query: () => ({
                url: "/shipping-addresses",
            }),
            providesTags: (result = []) => [
                "ShippingAddress",
                ...result.map(({id}) => ({type: "ShippingAddress" as const, id})),
            ],
        }),
        getDefaultShippingAddress: build.query<ShippingAddress, void>({
            query: () => ({
                url: "/shipping-addresses/default",
            }),
            providesTags: ["ShippingAddress"],
        }),
    }),
});

export const {
    useGetShippingAddressesQuery,
    useGetDefaultShippingAddressQuery,
    useLazyGetDefaultShippingAddressQuery,
} = shippingAddressApi;
