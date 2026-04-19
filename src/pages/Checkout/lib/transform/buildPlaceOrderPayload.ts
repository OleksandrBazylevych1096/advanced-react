import type {DeliverySelection} from "@/features/choose-delivery-date/@x/checkout/place-order/index.ts";

import type {ShippingAddress} from "@/entities/shipping-address";

import type {PlaceOrderRequest} from "../../model/types/checkoutTypes";

export const buildPlaceOrderPayload = (
    address: ShippingAddress,
    deliverySelection?: DeliverySelection | null,
): PlaceOrderRequest => {
    return {
        shippingAddress: address.streetAddress,
        shippingCity: address.city,
        shippingCountry: address.country,
        shippingPostal: address.zipCode,
        shippingNumberOfApartment: address.numberOfApartment,
        billingAddress: address.streetAddress,
        billingCity: address.city,
        billingCountry: address.country,
        billingPostal: address.zipCode,
        paymentMethod: "stripe",
        deliveryDate: deliverySelection?.deliveryDate,
        deliveryTime: deliverySelection?.deliveryTime,
    };
};
