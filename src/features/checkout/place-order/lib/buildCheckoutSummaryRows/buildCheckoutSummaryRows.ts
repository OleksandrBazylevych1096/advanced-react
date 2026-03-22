import type {OrderSummaryRow} from "@/entities/order";

import type {CheckoutSummary} from "../../model/types/checkoutTypes";

interface CheckoutSummaryLabels {
    itemsTotal: string;
    deliveryFee: string;
    serviceFee: string;
    tip: string;
    coupon: string;
}

export const buildCheckoutSummaryRows = (
    summary: CheckoutSummary,
    tip: number,
    couponDiscount: number,
    labels: CheckoutSummaryLabels,
): OrderSummaryRow[] => [
    {label: labels.itemsTotal, amount: summary.totals.subtotal},
    {label: labels.deliveryFee, amount: summary.totals.estimatedShipping},
    {label: labels.serviceFee, amount: summary.totals.estimatedTax},
    {label: labels.tip, amount: tip},
    {label: labels.coupon, amount: -couponDiscount},
];
