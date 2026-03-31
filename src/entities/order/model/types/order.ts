import type {Product} from "@/entities/product/@x/order";
import type {BaseShippingAddress} from "@/entities/shipping-address/@x/order";

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

export const OrderTimelineState = {
    DONE: "done",
    ACTIVE: "active",
    UPCOMING: "upcoming",
} as const;

export type OrderTimelineStateType = (typeof OrderTimelineState)[keyof typeof OrderTimelineState];

export const OrderTimelineStatus = {
    CONFIRMED: "CONFIRMED",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
} as const;

export type OrderTimelineStatusType =
    (typeof OrderTimelineStatus)[keyof typeof OrderTimelineStatus];

export interface OrderTimelineEvent {
    status: OrderTimelineStatusType;
    startedAt: string | null;
    plannedEndAt: string;
    state: OrderTimelineStateType;
}

export interface OrderTimeline {
    currentStatus: string;
    promisedDeliveryAt: string | null;
    hasPromisedDelivery: boolean;
    events: OrderTimelineEvent[];
}

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
    currency: string;
    shippingAddress?: BaseShippingAddress;
    deliveryDate?: string | null;
    deliveryTime?: string | null;
    createdAt?: string;
    updatedAt?: string;
    orderItems: OrderDetailsItem[];
    timeline: OrderTimeline;
}
