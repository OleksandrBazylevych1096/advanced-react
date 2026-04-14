import {mockOrderDetailsDelivered, mockOrderDetailsProcessing} from "@/entities/order/api/test/mockData";

import type {SettingsOrdersListResponse} from "../../model/types/settingsOrders";

export const mockSettingsOrdersListResponse: SettingsOrdersListResponse = {
    orders: [mockOrderDetailsProcessing, mockOrderDetailsDelivered],
    pagination: {
        hasNext: false,
        hasPrev: false,
        limit: 10,
        page: 1,
        total: 2,
        totalPages: 1,
    },
};

export const mockEmptySettingsOrdersListResponse: SettingsOrdersListResponse = {
    ...mockSettingsOrdersListResponse,
    orders: [],
    pagination: {
        ...mockSettingsOrdersListResponse.pagination,
        total: 0,
    },
};
