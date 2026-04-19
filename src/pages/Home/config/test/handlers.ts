import type {Product} from "@/entities/product";

import {API_URL} from "@/shared/config";
import {createHandlers, createMockFactory, sequence} from "@/shared/lib/testing";

const mockProductNames = ["Organic Bananas", "Fresh Milk", "Whole Wheat Bread"];

const createMockProduct = createMockFactory<Product>({
    id: sequence("prod"),
    name: (i) => mockProductNames[i % mockProductNames.length],
    description: "Fresh and organic produce straight from local farms",
    shortDescription: "Fresh quality groceries",
    slug: (i) => mockProductNames[i % mockProductNames.length].toLowerCase().replace(/\s+/g, "-"),
    stock: (i) => 10 + i,
    price: (i) => 10 + i * 5,
    images: [{url: "https://via.placeholder.com/300", alt: "Product image", isMain: true}],
    brand: "organic-valley",
    country: "Ukraine",
    categoryId: sequence("cat"),
    slugMap: (i) => ({
        en: mockProductNames[i % mockProductNames.length].toLowerCase().replace(/\s+/g, "-"),
        de: mockProductNames[i % mockProductNames.length].toLowerCase().replace(/\s+/g, "-"),
    }),
});

export const firstOrderProductsHandlers = createHandlers({
    endpoint: `${API_URL}/products/first-order-discount`,
    method: "get",
    defaultData: createMockProduct.createList(3),
    errorData: {error: "Failed to load first order products"},
    errorStatus: 500,
});
