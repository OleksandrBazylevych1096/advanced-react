import type {DeliverySelection} from "@/features/choose-delivery-date/@x/checkout/place-order/index.ts";

import type {ShippingAddress} from "@/entities/shipping-address";

import type {PlaceOrderRequest} from "../../model/types/checkoutTypes";

const DEFAULT_COUNTRY = "US";

export const buildPlaceOrderPayload = (
    address: ShippingAddress,
    deliverySelection?: DeliverySelection | null,
): PlaceOrderRequest => {
    return {
        shippingAddress: address.streetAddress,
        shippingCity: address.city,
        shippingCountry: DEFAULT_COUNTRY,
        shippingPostal: address.zipCode,
        shippingNumberOfApartment: address.numberOfApartment,
        billingAddress: address.streetAddress,
        billingCity: address.city,
        billingCountry: DEFAULT_COUNTRY,
        billingPostal: address.zipCode,
        paymentMethod: "stripe",
        deliveryDate: deliverySelection?.deliveryDate,
        deliveryTime: deliverySelection?.deliveryTime,
    };
};
