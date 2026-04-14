import {http, HttpResponse} from "msw";

import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {API_URL} from "@/shared/config";

import {
    mockEmptySettingsOrdersListResponse,
    mockSettingsOrdersListResponse,
} from "./mockData";

const getMyOrdersBase = createHandlers({
    endpoint: `${API_URL}/orders/my-orders`,
    method: "get",
    defaultData: mockSettingsOrdersListResponse,
    errorData: {error: "Failed to load orders"},
    errorStatus: 500,
});

export const settingsOrdersHandlers = {
    getMyOrders: extendHandlers(getMyOrdersBase, {
        empty: http.get(`${API_URL}/orders/my-orders`, () =>
            HttpResponse.json(mockEmptySettingsOrdersListResponse),
        ),
    }),
};
