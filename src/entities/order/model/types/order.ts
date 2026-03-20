export const PaymentStatus = {
    PENDING: "PENDING",
    PAID: "PAID",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED",
} as const;

export type PaymentStatusType = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const OrderStatus = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED",
} as const;

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];

export const CheckoutSessionStatus = {
    PENDING_PAYMENT: "pending_payment",
    PAID_PAYMENT: "paid",
    FAILED_PAYMENT: "payment_failed",
    EXPIRED: "expired",
    CANCELLED: "cancelled",
} as const;

export type CheckoutSessionStatusType =
    (typeof CheckoutSessionStatus)[keyof typeof CheckoutSessionStatus];
