import {mockSingleAddress} from "@/entities/shipping-address/api/test/mockData";

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

export const mockDefaultShippingAddress = mockSingleAddress;
