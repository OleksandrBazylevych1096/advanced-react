import type {Product, ProductFacets} from "@/entities/product";

import {API_URL} from "@/shared/config";
import {createHandlers, createMockFactory, sequence} from "@/shared/lib/testing";

const mockProductNames = ["Organic Bananas", "Fresh Milk", "Whole Wheat Bread", "Greek Yogurt"];

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

const mockFacets: ProductFacets = {
    countries: [{value: "Ukraine", label: "Ukraine", count: 45}],
    brands: [{value: "organic-valley", label: "Organic Valley", count: 23}],
    priceRange: {
        min: 1,
        max: 100,
    },
};

const mockProducts = createMockProduct.createList(20);

export const bestSellingProductsHandlers = createHandlers({
    endpoint: `${API_URL}/products/best-sellers`,
    method: "get",
    defaultData: {
        facets: mockFacets,
        products: mockProducts.slice(0, 20),
        pagination: {
            hasNext: true,
            hasPrev: false,
            limit: 20,
            page: 1,
            total: 50,
            totalPages: 3,
        },
    },
    errorData: {error: "Failed to load products"},
    errorStatus: 500,
});
