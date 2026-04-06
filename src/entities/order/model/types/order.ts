import type {Product} from "@/entities/product/@x/order";
import type {BaseShippingAddress} from "@/entities/shipping-address/@x/order";

import type {CurrencyType} from "@/shared/config";

export const CreditCardBrand = {
    VISA: "visa",
    MASTERCARD: "mastercard",
    AMEX: "amex",
    DISCOVER: "discover",
} as const;

export type CreditCardBrandType = (typeof CreditCardBrand)[keyof typeof CreditCardBrand];

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

export interface OrderTimelineEvent {
    id: string;
    status: string;
    timestamp: string | null;
    progress: number;
    note?: string;
}

export type OrderTimeline = OrderTimelineEvent[];

export interface OrderDetailsItem {
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: Product;
}

export interface OrderDetails {
    id: string;
    orderNumber: string;
    status: OrderStatusType;
    paymentStatus: PaymentStatusType;
    paymentCardBrand?: CreditCardBrandType | null;
    paymentCardLast4?: string | null;
    totalAmount: number;
    shippingAmount: number;
    subtotalAmount: number;
    taxAmount: number;
    discountAmount: number;
    tipAmount: number;
    couponCode?: string | null;
    currency: CurrencyType;
    shippingAddress?: BaseShippingAddress;
    deliveryDate?: string | null;
    deliveryTime?: string | null;
    createdAt?: string;
    cancelledAt?: string | null;
    refundedAt?: string | null;
    updatedAt?: string;
    orderItems: OrderDetailsItem[];
    timeline: OrderTimeline;
}
