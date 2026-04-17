import {
    CheckoutSessionStatus,
    OrderStatus,
    PaymentStatus,
} from "@/entities/order/model/types/order";

import type {CheckoutSessionDetails} from "../../model/types/checkoutResultTypes";

export const mockCheckoutSessionPending: CheckoutSessionDetails = {
    sessionId: "sess_123",
    stripePaymentIntentId: "pi_123",
    stripeClientSecret: "cs_test_secret",
    status: CheckoutSessionStatus.PENDING_PAYMENT,
    currency: "usd",
    amount: 177,
    expiresAt: "2026-03-20T12:00:00.000Z",
    order: {
        id: "order-1",
        orderNumber: "ORD-2026-0001",
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
    },
};

export const mockCheckoutSessionPaid: CheckoutSessionDetails = {
    ...mockCheckoutSessionPending,
    status: CheckoutSessionStatus.PAID_PAYMENT,
    order: {
        ...mockCheckoutSessionPending.order!,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
    },
};

export const mockCheckoutSessionFailed: CheckoutSessionDetails = {
    ...mockCheckoutSessionPending,
    status: CheckoutSessionStatus.FAILED_PAYMENT,
    order: {
        ...mockCheckoutSessionPending.order!,
        paymentStatus: PaymentStatus.FAILED,
    },
};
