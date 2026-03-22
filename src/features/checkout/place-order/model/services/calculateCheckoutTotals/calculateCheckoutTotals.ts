import type {CheckoutSummary} from "../../../model/types/checkoutTypes.ts";

export interface CalculatedCheckoutTotals {
    couponDiscount: number;
    totalAmount: number;
}

export const calculateCheckoutTotals = (
    summary: CheckoutSummary,
    tip: number,
): CalculatedCheckoutTotals => {
    const couponDiscount = summary.coupon?.isValid
        ? summary.coupon.discountAmount
        : (summary.totals.discountAmount ?? 0);

    const totalAmount =
        summary.totals.subtotal +
        summary.totals.estimatedShipping +
        summary.totals.estimatedTax +
        tip -
        couponDiscount;

    return {
        couponDiscount,
        totalAmount,
    };
};
