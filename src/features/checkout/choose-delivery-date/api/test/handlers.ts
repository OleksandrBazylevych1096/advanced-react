import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {mockDefaultShippingAddress, mockDeliveryDates} from "./mockData";

const defaultAddressBase = createHandlers({
    endpoint: `${API_URL}/shipping-addresses/default`,
    method: "get",
    defaultData: mockDefaultShippingAddress,
    errorData: {error: "Failed to load default address"},
    errorStatus: 500,
});

const deliverySlotsBase = createHandlers({
    endpoint: `${API_URL}/delivery-selection/slots`,
    method: "get",
    defaultData: {availableDates: mockDeliveryDates},
    errorData: {error: "Failed to load delivery slots"},
    errorStatus: 500,
});

const setDeliverySlotBase = createHandlers({
    endpoint: `${API_URL}/delivery-selection`,
    method: "patch",
    defaultData: {
        deliveryDate: "2026-03-12",
        deliveryTime: "12:00",
    },
    errorData: {error: "Failed to save delivery slot"},
    errorStatus: 400,
});

const deliverySelectionBase = createHandlers({
    endpoint: `${API_URL}/delivery-selection`,
    method: "get",
    defaultData: {
        deliveryDate: "2026-03-12",
        deliveryTime: "12:00",
    },
    errorData: {error: "Failed to load delivery selection"},
    errorStatus: 500,
});

export const chooseDeliveryDateHandlers = {
    defaultAddress: extendHandlers(defaultAddressBase, {
        none: http.get(`${API_URL}/shipping-addresses/default`, () => HttpResponse.json(null)),
    }),
    deliverySlots: extendHandlers(deliverySlotsBase, {
        empty: http.get(`${API_URL}/delivery-selection/slots`, () =>
            HttpResponse.json({availableDates: []}),
        ),
    }),
    deliverySelection: extendHandlers(deliverySelectionBase, {
        none: http.get(`${API_URL}/delivery-selection`, () => HttpResponse.json(null)),
    }),
    setDeliverySlot: setDeliverySlotBase,
};

