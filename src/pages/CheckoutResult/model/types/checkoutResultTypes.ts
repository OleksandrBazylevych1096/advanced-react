import {
    CheckoutSessionStatus,
    type CheckoutSessionStatusType,
    type OrderStatusType,
    PaymentStatus,
    type PaymentStatusType,
} from "@/entities/order/model/types/order";

export {CheckoutSessionStatus, PaymentStatus};
export type {CheckoutSessionStatusType, PaymentStatusType};

export interface CheckoutSessionOrderSnapshot {
    id: string;
    orderNumber: string;
    status: OrderStatusType;
    paymentStatus: PaymentStatusType;
}

export interface CheckoutSessionDetails {
    sessionId: string;
    stripePaymentIntentId: string;
    stripeClientSecret: string;
    status: CheckoutSessionStatusType;
    currency: string;
    amount: number;
    tipAmount?: number;
    discountAmount?: number;
    couponCode?: string | null;
    expiresAt: string;
    order: CheckoutSessionOrderSnapshot | null;
}
