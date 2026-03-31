import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {
    mockOrderDetailsDelivered,
    mockOrderDetailsNoDeliveryDate,
    mockOrderDetailsProcessing,
} from "./mockData";

const getOrderByIdBase = createHandlers({
    endpoint: `${API_URL}/orders/:id`,
    method: "get",
    defaultData: mockOrderDetailsProcessing,
    errorData: {error: "Failed to load order"},
    errorStatus: 500,
});

export const orderHandlers = {
    getOrderById: extendHandlers(getOrderByIdBase, {
        delivered: http.get(`${API_URL}/orders/:id`, () =>
            HttpResponse.json(mockOrderDetailsDelivered),
        ),
        noDeliveryDate: http.get(`${API_URL}/orders/:id`, () =>
            HttpResponse.json(mockOrderDetailsNoDeliveryDate),
        ),
    }),
};
