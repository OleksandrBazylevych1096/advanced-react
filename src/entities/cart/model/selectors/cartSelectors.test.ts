import {describe, expect, test} from "vitest";

import {createMockProduct} from "@/entities/product/api/test/mockData";

import {
    selectGuestCartItemByProductId,
    selectGuestCartItemCount,
    selectGuestCartItems,
    selectGuestCartSubtotal,
    selectIsCartInitialized,
} from "./cartSelectors";

describe("cartSelectors", () => {
    const createState = (cart: StateSchema["cart"]) => ({cart}) as unknown as StateSchema;

    test("returns guest items and initialization flag", () => {
        const state = createState({
            guestItems: [
                {
                    productId: "p1",
                    quantity: 2,
                    addedAt: 1,
                    product: {
                        ...createMockProduct({id: "p1", name: "Apple", price: 100}),
                    },
                },
            ],
            isInitialized: true,
        });

        expect(selectGuestCartItems(state)).toHaveLength(1);
        expect(selectIsCartInitialized(state)).toBe(true);
    });

    test("calculates total item count and subtotal", () => {
        const state = createState({
            guestItems: [
                {
                    productId: "p1",
                    quantity: 2,
                    addedAt: 1,
                    product: {
                        ...createMockProduct({id: "p1", name: "Apple", price: 100}),
                    },
                },
                {
                    productId: "p2",
                    quantity: 3,
                    addedAt: 2,
                    product: {
                        ...createMockProduct({id: "p2", name: "Samsung", price: 50}),
                    },
                },
            ],
            isInitialized: false,
        });

        expect(selectGuestCartItemCount(state)).toBe(5);
        expect(selectGuestCartSubtotal(state)).toBe(350);
    });

    test("returns matching cart item by product id", () => {
        const state = createState({
            guestItems: [
                {
                    productId: "p1",
                    quantity: 1,
                    addedAt: 1,
                    product: {
                        ...createMockProduct({id: "p1", name: "Apple", price: 100}),
                    },
                },
            ],
            isInitialized: true,
        });

        expect(selectGuestCartItemByProductId(state, "p1")?.quantity).toBe(1);
        expect(selectGuestCartItemByProductId(state, "missing")).toBeUndefined();
    });

    test("returns zero totals for empty guest cart", () => {
        const state = createState({
            guestItems: [],
            isInitialized: false,
        });

        expect(selectGuestCartItemCount(state)).toBe(0);
        expect(selectGuestCartSubtotal(state)).toBe(0);
    });
});
