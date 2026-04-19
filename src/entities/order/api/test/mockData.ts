import {createMockCartItem} from "@/entities/cart/@x/order";
import {OrderStatus, PaymentStatus} from "@/entities/order/model/types/order";

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
    timeline: [
        {
            id: "pending",
            status: "PENDING",
            timestamp: "2026-03-24T00:00:00.000Z",
            progress: 100,
        },
        {
            id: "confirmed",
            status: "CONFIRMED",
            timestamp: "2026-03-24T01:20:00.000Z",
            progress: 100,
        },
        {
            id: "processing",
            status: "PROCESSING",
            timestamp: "2026-03-24T01:20:00.000Z",
            progress: 100,
        },
        {
            id: "shipped",
            status: "SHIPPED",
            timestamp: null,
            progress: 70,
        },
        {
            id: "delivered",
            status: "DELIVERED",
            timestamp: null,
            progress: 0,
        },
    ],
};

export const mockOrderDetailsDelivered: OrderDetails = {
    ...mockOrderDetailsProcessing,
    status: OrderStatus.DELIVERED,
    timeline: [
        {
            id: "pending",
            status: "PENDING",
            timestamp: "2026-03-24T00:00:00.000Z",
            progress: 100,
        },
        {
            id: "confirmed",
            status: "CONFIRMED",
            timestamp: "2026-03-24T00:00:00.000Z",
            progress: 100,
        },
        {
            id: "processing",
            status: "PROCESSING",
            timestamp: "2026-03-24T00:00:00.000Z",
            progress: 100,
        },
        {
            id: "shipped",
            status: "SHIPPED",
            timestamp: "2026-03-24T00:00:00.000Z",
            progress: 100,
        },
        {
            id: "delivered",
            status: "DELIVERED",
            timestamp: "2026-03-24T05:20:00.000Z",
            progress: 100,
        },
    ],
};

export const mockOrderDetailsNoDeliveryDate: OrderDetails = {
    ...mockOrderDetailsProcessing,
    deliveryDate: null,
    deliveryTime: null,
    timeline: [...mockOrderDetailsProcessing.timeline],
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
