import type {CartItem, CartTotals, CartValidationItem} from "@/entities/cart";
import {
    type CheckoutSessionStatusType,
    type OrderStatusType,
    type PaymentStatusType,
} from "@/entities/order";

import type {SupportedLngsType} from "@/shared/config";

export const PaymentMethod = {
    STRIPE: "stripe",
} as const;

export type PaymentMethodType = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface CheckoutSummary {
    items: CartItem[];
    totals: CartTotals;
    coupon?: {
        code: string | null;
        isValid: boolean;
        discountAmount: number;
        message?: string;
    };
    validation: CartValidationItem[];
}

export interface PlaceOrderRequest {
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    shippingPostal: string;
    billingAddress?: string;
    billingCity?: string;
    billingCountry?: string;
    billingPostal?: string;
    paymentMethod: PaymentMethodType;
    locale?: SupportedLngsType;
    deliveryDate?: string;
    deliveryTime?: string;
    currency?: string;
    couponCode?: string;
    tipAmount?: number;
    successUrl?: string;
    cancelUrl?: string;
}

export interface PlaceOrderResponse {
    sessionId: string;
    stripePaymentIntentId: string;
    stripeClientSecret: string;
    stripeCheckoutSessionId?: string;
    checkoutUrl?: string;
    status: CheckoutSessionStatusType;
    amount: number;
    currency: string;
    tipAmount?: number;
    discountAmount?: number;
    couponCode?: string | null;
    expiresAt: string;
}

export interface OrderDetails {
    id: string;
    orderNumber: string;
    paymentStatus: PaymentStatusType;
    status: OrderStatusType;
    totalAmount: number;
}
