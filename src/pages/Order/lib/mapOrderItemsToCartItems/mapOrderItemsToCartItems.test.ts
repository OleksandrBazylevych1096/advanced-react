import {describe, expect, test} from "vitest";

import {mapOrderItemsToCartItems} from "./mapOrderItemsToCartItems";

describe("mapOrderItemsToCartItems", () => {
    test("returns empty array for missing order items", () => {
        expect(mapOrderItemsToCartItems(undefined)).toEqual([]);
    });

    test("maps order items to cart items shape", () => {
        const result = mapOrderItemsToCartItems([
            {
                id: "oi-1",
                quantity: 2,
                price: 35,
                total: 70,
                product: {
                    id: "p-1",
                    name: "Mouse",
                    description: "Wireless mouse",
                    shortDescription: "Mouse",
                    slug: "mouse",
                    price: 35,
                    oldPrice: 40,
                    stock: 10,
                    categoryId: "cat-1",
                    slugMap: {en: "mouse", de: "mouse"},
                    images: [{url: "https://picsum.photos/1", alt: "Mouse", isMain: true}],
                },
            },
        ]);

        expect(result).toEqual([
            {
                id: "oi-1",
                quantity: 2,
                product: {
                    id: "p-1",
                    name: "Mouse",
                    description: "Wireless mouse",
                    shortDescription: "Mouse",
                    slug: "mouse",
                    price: 35,
                    oldPrice: 40,
                    stock: 10,
                    categoryId: "cat-1",
                    slugMap: {en: "mouse", de: "mouse"},
                    images: [{url: "https://picsum.photos/1", alt: "Mouse", isMain: true}],
                },
            },
        ]);
    });
});
