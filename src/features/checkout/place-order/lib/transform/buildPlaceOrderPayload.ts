import type {DeliverySelection, PlaceOrderRequest} from "@/features/checkout/place-order";

import type {ShippingAddress} from "@/entities/shipping-address";

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
        billingAddress: address.streetAddress,
        billingCity: address.city,
        billingCountry: DEFAULT_COUNTRY,
        billingPostal: address.zipCode,
        paymentMethod: "stripe",
        deliveryDate: deliverySelection?.deliveryDate,
        deliveryTime: deliverySelection?.deliveryTime,
    };
};
