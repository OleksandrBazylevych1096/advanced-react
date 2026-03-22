import {describe, expect, test} from "vitest";

import {buildCheckoutSummaryRows} from "./buildCheckoutSummaryRows.ts";

describe("buildCheckoutSummaryRows", () => {
    test("builds checkout summary rows in fixed order", () => {
        const rows = buildCheckoutSummaryRows(
            {
                items: [],
                totals: {
                    subtotal: 100,
                    freeShippingTarget: 150,
                    totalItems: 2,
                    estimatedShipping: 10,
                    estimatedTax: 5,
                    total: 115,
                },
                validation: [],
            },
            3,
            7,
            {
                itemsTotal: "Items total",
                deliveryFee: "Delivery fee",
                serviceFee: "Service fee",
                tip: "Tip",
                coupon: "Coupon",
            },
        );

        expect(rows).toEqual([
            {label: "Items total", amount: 100},
            {label: "Delivery fee", amount: 10},
            {label: "Service fee", amount: 5},
            {label: "Tip", amount: 3},
            {label: "Coupon", amount: -7},
        ]);
    });
});
