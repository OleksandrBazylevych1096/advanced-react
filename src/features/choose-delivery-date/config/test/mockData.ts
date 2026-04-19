import type {ShippingAddress} from "@/entities/shipping-address";

import type {AvailableDeliveryDate} from "../../model/types/availableDeliveryDateTypes";

export const mockDeliveryDates: AvailableDeliveryDate[] = [
    {
        date: "2026-03-12",
        slots: ["10:00", "12:00", "14:00"],
    },
    {
        date: "2026-03-13",
        slots: ["10:00", "16:00"],
    },
];

export const mockDefaultShippingAddress: ShippingAddress = {
    id: "1",
    streetAddress: "1 Trafalgar Square",
    city: "London",
    country: "GB",
    numberOfApartment: "5",
    zipCode: "WC2N 5DN",
    isDefault: true,
    latitude: 51.5074,
    longitude: -0.1278,
};
