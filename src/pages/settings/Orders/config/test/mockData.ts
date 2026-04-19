import {OrderStatus, PaymentStatus, type OrderDetails} from "@/entities/order/model/types/order";

import type {SettingsOrdersListResponse} from "../../model/types/settingsOrders";

const createMockOrder = (overrides?: Partial<OrderDetails>): OrderDetails => ({
    id: "order-1",
    orderNumber: "ORD-2026-0001",
    status: OrderStatus.PROCESSING,
    paymentStatus: PaymentStatus.PAID,
    paymentCardBrand: "visa",
    paymentCardLast4: "4242",
    totalAmount: 177,
    shippingAmount: 10,
    subtotalAmount: 159,
    taxAmount: 8,
    discountAmount: 5,
    tipAmount: 5,
    couponCode: "SAVE5",
    currency: "USD",
    shippingAddress: {
        streetAddress: "1 Trafalgar Square",
        city: "London",
        country: "GB",
        numberOfApartment: "5",
        zipCode: "WC2N 5DN",
    },
    deliveryDate: "2026-03-24T00:00:00.000Z",
    deliveryTime: "18:00",
    createdAt: "2026-03-24T01:00:00.000Z",
    updatedAt: "2026-03-24T01:20:00.000Z",
    orderItems: [],
    timeline: [],
    ...overrides,
});

const mockOrderDetailsProcessing = createMockOrder();
const mockOrderDetailsDelivered = createMockOrder({
    id: "order-2",
    orderNumber: "ORD-2026-0002",
    status: OrderStatus.DELIVERED,
});

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
