import type {AvailableDeliveryDate} from "../../state/types/availableDeliveryDateTypes";

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

export const mockDefaultShippingAddress = {
    id: "addr-story-1",
    streetAddress: "Main Street 10",
    city: "Kyiv",
    numberOfApartment: "12",
    zipCode: "01001",
    isDefault: true,
    latitude: 50.4501,
    longitude: 30.5234,
};

