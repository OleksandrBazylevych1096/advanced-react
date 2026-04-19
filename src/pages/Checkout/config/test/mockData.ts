import {createMockCartItem} from "@/entities/cart/@x/order";
import {CheckoutSessionStatus, OrderStatus, PaymentStatus} from "@/entities/order";

import type {CheckoutSummary, PlaceOrderResponse} from "../../model/types/checkoutTypes";

export const mockCheckoutSummary: CheckoutSummary = {
    items: [
        createMockCartItem({
            quantity: 2,
        }),
        createMockCartItem({
            quantity: 1,
        }),
    ],
    totals: {
        subtotal: 159,
        freeShippingTarget: 200,
        totalItems: 3,
        estimatedShipping: 10,
        estimatedTax: 8,
        total: 177,
    },
    coupon: {
        code: null,
        isValid: true,
        discountAmount: 0,
    },
    validation: [],
};

export const mockCheckoutSummaryWithCoupon: CheckoutSummary = {
    ...mockCheckoutSummary,
    totals: {
        ...mockCheckoutSummary.totals,
        total: 157,
        discountAmount: 20,
    },
    coupon: {
        code: "SAVE20",
        isValid: true,
        discountAmount: 20,
        message: "Coupon applied",
    },
};

export const mockPlaceOrderResponse: PlaceOrderResponse = {
    sessionId: "sess_123",
    stripePaymentIntentId: "pi_123",
    stripeClientSecret: "cs_test_secret",
    checkoutUrl: "https://checkout.stripe.test/session/123",
    status: CheckoutSessionStatus.PENDING_PAYMENT,
    amount: 177,
    currency: "usd",
    tipAmount: 0,
    discountAmount: 0,
    couponCode: null,
    expiresAt: "2026-03-20T12:00:00.000Z",
};

export const mockOrderDetails = {
    id: "order-1",
    orderNumber: "ORD-2026-0001",
    status: OrderStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
};
