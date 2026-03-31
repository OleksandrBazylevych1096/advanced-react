import {
    shippingAddressApi,
    useGetShippingAddressesQuery,
    useGetDefaultShippingAddressQuery,
    useLazyGetDefaultShippingAddressQuery,
} from "./api/shippingAddressApi/shippingAddressApi";
import {buildShippingAddressLabel} from "./lib/buildShippingAddressLabel";
import {
    SHIPPING_ADDRESSES_DOMAIN_KEY,
    shippingAddressOptimisticVersionGuard,
} from "./model/optimisticVersionGuard";
import type {
    ShippingAddress,
    BaseShippingAddress,
    CreateShippingAddress,
    UpdateShippingAddress,
    AddressSearchResult,
    ReverseGeocodeResult,
    BaseAddress,
    AddressMode,
    SaveShippingAddressSchema,
} from "./model/types/types";

export {
    // API
    shippingAddressApi,
    useGetShippingAddressesQuery,
    useGetDefaultShippingAddressQuery,
    useLazyGetDefaultShippingAddressQuery,
    SHIPPING_ADDRESSES_DOMAIN_KEY,
    shippingAddressOptimisticVersionGuard,
    buildShippingAddressLabel,
};

export type {
    ShippingAddress,
    BaseShippingAddress,
    CreateShippingAddress,
    UpdateShippingAddress,
    AddressSearchResult,
    ReverseGeocodeResult,
    BaseAddress,
    AddressMode,
    SaveShippingAddressSchema,
};
