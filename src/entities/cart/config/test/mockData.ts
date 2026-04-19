import {createMockProduct} from "@/entities/product/config/test/mockData";

import {createMockFactory, sequence} from "@/shared/lib/testing";

import type {Cart, CartValidationItem} from "../../model/types/CartSchema";

export const createMockCartItem = createMockFactory<Cart["items"][number]>({
    id: sequence("ci"),
    quantity: 1,
    product: (i) =>
        createMockProduct({
            id: `p-${i + 1}`,
        }),
});

export const mockCart: Cart = {
    items: [
        createMockCartItem({
            quantity: 2,
        }),
        createMockCartItem({
            quantity: 1,
        }),
    ],
    totals: {
        subtotal: 159,
        freeShippingTarget: 200,
        totalItems: 3,
        estimatedShipping: 10,
        estimatedTax: 8,
        total: 177,
    },
};

export const mockCartValidation: CartValidationItem[] = [];

export const mockCartValidationWithIssues: CartValidationItem[] = [
    {
        cartItemId: "ci-1",
        productId: "p-1",
        requestedQuantity: 2,
        availableQuantity: 1,
        isValid: false,
        issues: ["Only 1 left in stock"],
    },
];
