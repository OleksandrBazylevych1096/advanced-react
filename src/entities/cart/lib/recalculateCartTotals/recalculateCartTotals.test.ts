import {describe, expect, test} from "vitest";

import type {DeepPartial} from "@/shared/lib/state/redux/types";

import type {Cart} from "../../model/types/CartSchema";

import {recalculateCartTotals} from "./recalculateCartTotals";

const createCart = (price: number, quantity: number): DeepPartial<Cart> => ({
    items: [
        {
            quantity,
            product: {
                price,
            },
        },
    ],
    totals: {
        subtotal: 0,
        freeShippingTarget: 100,
        totalItems: 0,
        estimatedShipping: 0,
        estimatedTax: 0,
        total: 0,
    },
});

describe("recalculateCartTotals", () => {
    test("applies 10% tax and shipping 10 when subtotal is 100 or less", () => {
        const cart = createCart(40, 2);

        recalculateCartTotals(cart as Cart);

        expect(cart.totals).toMatchObject({
            subtotal: 80,
            totalItems: 2,
            estimatedTax: 8,
            estimatedShipping: 10,
            total: 98,
        });
    });

    test("applies free shipping when subtotal is greater than 100", () => {
        const cart = createCart(60, 2);

        recalculateCartTotals(cart as Cart);

        expect(cart.totals).toMatchObject({
            subtotal: 120,
            totalItems: 2,
            estimatedTax: 12,
            estimatedShipping: 0,
            total: 132,
        });
    });
});
