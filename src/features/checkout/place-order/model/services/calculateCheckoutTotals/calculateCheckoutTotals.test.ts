import {describe, expect, test} from "vitest";

import {calculateCheckoutTotals} from "./calculateCheckoutTotals.ts";

const createSummary = (coupon?: {isValid: boolean; discountAmount: number}) => ({
    items: [],
    totals: {
        subtotal: 100,
        freeShippingTarget: 150,
        totalItems: 2,
        estimatedShipping: 10,
        estimatedTax: 5,
        total: 115,
        discountAmount: 7,
    },
    validation: [],
    coupon: coupon
        ? {
              code: "SAVE",
              message: "ok",
              ...coupon,
          }
        : undefined,
});

describe("calculateCheckoutTotals", () => {
    test("uses coupon discount when coupon is valid", () => {
        const result = calculateCheckoutTotals(
            createSummary({isValid: true, discountAmount: 12}),
            3,
        );

        expect(result.couponDiscount).toBe(12);
        expect(result.totalAmount).toBe(106);
    });

    test("uses totals discount amount when coupon is invalid", () => {
        const result = calculateCheckoutTotals(
            createSummary({isValid: false, discountAmount: 50}),
            0,
        );

        expect(result.couponDiscount).toBe(7);
        expect(result.totalAmount).toBe(108);
    });
});
