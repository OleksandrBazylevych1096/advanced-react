import {CheckoutSessionStatus, OrderStatus, PaymentStatus} from "@/entities/order";

import type {CheckoutSummary, PlaceOrderResponse} from "../../model/types/checkoutTypes";

export const mockCheckoutSummary: CheckoutSummary = {
    items: [
        {
            id: "ci-1",
            productId: "p-1",
            quantity: 2,
            product: {
                id: "p-1",
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse",
                shortDescription: "Ergonomic mouse",
                slug: "wireless-mouse",
                price: 35,
                oldPrice: 45,
                stock: 12,
                images: [
                    {
                        url: "https://picsum.photos/seed/mouse/120/120",
                        alt: "Wireless mouse",
                        isMain: true,
                    },
                ],
                categoryId: "cat-1",
                slugMap: {en: "wireless-mouse", de: "wireless-mouse"},
            },
        },
        {
            id: "ci-2",
            productId: "p-2",
            quantity: 1,
            product: {
                id: "p-2",
                name: "Mechanical Keyboard",
                description: "75% mechanical keyboard",
                shortDescription: "Mechanical keyboard",
                slug: "mechanical-keyboard",
                price: 89,
                stock: 8,
                images: [
                    {
                        url: "https://picsum.photos/seed/keyboard/120/120",
                        alt: "Keyboard",
                        isMain: true,
                    },
                ],
                categoryId: "cat-1",
                slugMap: {en: "mechanical-keyboard", de: "mechanical-keyboard"},
            },
        },
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
