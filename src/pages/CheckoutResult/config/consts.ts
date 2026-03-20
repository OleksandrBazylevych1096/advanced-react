import {CheckoutSessionStatus, type CheckoutSessionStatusType} from "@/entities/order";

export const POLLING_INTERVAL_MS = 600;
export const FALLBACK_CONFIRM_DELAY_MS = 30_000;
export const MAX_PENDING_POLLING_MS = 120_000;

export const DECLINED_STATUSES: ReadonlySet<CheckoutSessionStatusType> = new Set([
    CheckoutSessionStatus.FAILED_PAYMENT,
    CheckoutSessionStatus.CANCELLED,
    CheckoutSessionStatus.EXPIRED,
]);

export const TERMINAL_STATUSES: ReadonlySet<CheckoutSessionStatusType> = new Set([
    CheckoutSessionStatus.PAID_PAYMENT,
    ...DECLINED_STATUSES,
]);
