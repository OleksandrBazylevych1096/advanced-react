import {
    CheckoutSessionStatus,
    PaymentStatus,
    type CheckoutSessionStatusType,
    type PaymentStatusType,
} from "@/entities/order";

import {DECLINED_STATUSES} from "../config/consts";

export function resolvePaymentStatus(
    orderPaymentStatus: PaymentStatusType | undefined,
    sessionStatus: CheckoutSessionStatusType | null,
): PaymentStatusType | null {
    if (orderPaymentStatus != null) return orderPaymentStatus;

    if (sessionStatus === CheckoutSessionStatus.PAID_PAYMENT) return PaymentStatus.PAID;
    if (sessionStatus != null && DECLINED_STATUSES.has(sessionStatus)) return PaymentStatus.FAILED;
    if (sessionStatus === CheckoutSessionStatus.PENDING_PAYMENT) return PaymentStatus.PENDING;

    return null;
}
