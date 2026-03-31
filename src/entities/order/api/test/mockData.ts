import {createMockCartItem} from "@/entities/cart/@x/order";
import {OrderStatus, PaymentStatus} from "@/entities/order";

import type {OrderDetails} from "../../model/types/order";

const mapCartItemToOrderItem = (cartItem: ReturnType<typeof createMockCartItem>) => ({
    id: cartItem.id.replace("ci-", "oi-"),
    quantity: cartItem.quantity,
    price: cartItem.product.price,
    total: cartItem.product.price * cartItem.quantity,
    product: cartItem.product,
});

export const mockOrderDetailsProcessing: OrderDetails = {
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
    currency: "usd",
    shippingAddress: {
        streetAddress: "1 Trafalgar Square",
        city: "London",
        numberOfApartment: "5",
        zipCode: "WC2N 5DN",
    },
    deliveryDate: "2026-03-24T00:00:00.000Z",
    deliveryTime: "18:00",
    createdAt: "2026-03-24T01:00:00.000Z",
    updatedAt: "2026-03-24T01:20:00.000Z",
    orderItems: [
        mapCartItemToOrderItem(
            createMockCartItem({
                quantity: 2,
            }),
        ),
        mapCartItemToOrderItem(
            createMockCartItem({
                quantity: 1,
            }),
        ),
    ],
    timeline: {
        currentStatus: OrderStatus.PROCESSING,
        promisedDeliveryAt: "2026-03-24T18:00:00.000Z",
        hasPromisedDelivery: true,
        events: [
            {
                status: "CONFIRMED",
                startedAt: "2026-03-24T00:30:00.000Z",
                plannedEndAt: "2026-03-24T01:30:00.000Z",
                state: "done",
            },
            {
                status: "PROCESSING",
                startedAt: "2026-03-24T01:30:00.000Z",
                plannedEndAt: "2026-03-24T05:30:00.000Z",
                state: "active",
            },
            {
                status: "SHIPPED",
                startedAt: null,
                plannedEndAt: "2026-03-24T17:30:00.000Z",
                state: "upcoming",
            },
            {
                status: "DELIVERED",
                startedAt: null,
                plannedEndAt: "2026-03-24T18:00:00.000Z",
                state: "upcoming",
            },
        ],
    },
};

export const mockOrderDetailsDelivered: OrderDetails = {
    ...mockOrderDetailsProcessing,
    status: OrderStatus.DELIVERED,
    timeline: {
        ...mockOrderDetailsProcessing.timeline,
        currentStatus: OrderStatus.DELIVERED,
        events: [
            {
                status: "CONFIRMED",
                startedAt: "2026-03-24T00:30:00.000Z",
                plannedEndAt: "2026-03-24T01:30:00.000Z",
                state: "done",
            },
            {
                status: "PROCESSING",
                startedAt: "2026-03-24T01:30:00.000Z",
                plannedEndAt: "2026-03-24T05:30:00.000Z",
                state: "done",
            },
            {
                status: "SHIPPED",
                startedAt: "2026-03-24T05:30:00.000Z",
                plannedEndAt: "2026-03-24T17:30:00.000Z",
                state: "done",
            },
            {
                status: "DELIVERED",
                startedAt: "2026-03-24T17:30:00.000Z",
                plannedEndAt: "2026-03-24T18:00:00.000Z",
                state: "done",
            },
        ],
    },
};

export const mockOrderDetailsNoDeliveryDate: OrderDetails = {
    ...mockOrderDetailsProcessing,
    deliveryDate: null,
    deliveryTime: null,
    timeline: {
        ...mockOrderDetailsProcessing.timeline,
        promisedDeliveryAt: null,
        hasPromisedDelivery: false,
    },
};

export const mockOrderDetailsNoAddress: OrderDetails = {
    ...mockOrderDetailsProcessing,
    shippingAddress: undefined,
};

export const mockOrderDetailsNoPaymentCard: OrderDetails = {
    ...mockOrderDetailsProcessing,
    paymentCardBrand: null,
    paymentCardLast4: null,
};
