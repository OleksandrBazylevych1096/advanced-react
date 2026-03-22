import type {Cart, CartValidationItem} from "../../model/types/CartSchema";

export const mockCart: Cart = {
    items: [
        {
            id: "ci-1",
            productId: "p-1",
            quantity: 2,
            product: {
                id: "p-1",
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse",
                shortDescription: "Ergonomic mouse",
                slug: "wireless-mouse",
                price: 35,
                oldPrice: 45,
                stock: 12,
                images: [
                    {
                        url: "https://picsum.photos/seed/mouse/120/120",
                        alt: "Wireless mouse",
                        isMain: true,
                    },
                ],
                categoryId: "cat-1",
                slugMap: {en: "wireless-mouse", de: "wireless-mouse"},
            },
        },
        {
            id: "ci-2",
            productId: "p-2",
            quantity: 1,
            product: {
                id: "p-2",
                name: "Mechanical Keyboard",
                description: "75% mechanical keyboard",
                shortDescription: "Mechanical keyboard",
                slug: "mechanical-keyboard",
                price: 89,
                stock: 8,
                images: [
                    {
                        url: "https://picsum.photos/seed/keyboard/120/120",
                        alt: "Keyboard",
                        isMain: true,
                    },
                ],
                categoryId: "cat-1",
                slugMap: {en: "mechanical-keyboard", de: "mechanical-keyboard"},
            },
        },
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
