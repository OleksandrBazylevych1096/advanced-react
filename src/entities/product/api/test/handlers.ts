import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {createMockProduct, emptyFacets, mockFacets, mockProducts} from "./mockData.ts";

const baseHandlers = createHandlers({
    endpoint: `${API_URL}/products`,
    method: "get",
    defaultData: {
        facets: mockFacets,
        products: mockProducts,
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

const page2Products = createMockProduct.createList(20);
const page3Products = createMockProduct.createList(20);

export const productsHandlers = extendHandlers(baseHandlers, {
    withEuroCurrency: http.get(`${API_URL}/products`, () => {
        const euroProducts = mockProducts.map((p) => ({
            ...p,
            currency: "EUR",
            price: Math.round(p.price * 0.92),
        }));

        return HttpResponse.json({
            facets: mockFacets,
            products: euroProducts,
            pagination: {
                hasNext: true,
                hasPrev: false,
                limit: 20,
                page: 1,
                total: 50,
                totalPages: 3,
            },
        });
    }),

    empty: http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
            facets: emptyFacets,
            products: [],
            pagination: {
                hasNext: false,
                hasPrev: false,
                limit: 20,
                page: 1,
                total: 0,
                totalPages: 0,
            },
        });
    }),

    withPagination: http.get(`${API_URL}/products`, ({request}) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);

        let products: typeof mockProducts;
        switch (page) {
            case 1:
                products = mockProducts;
                break;
            case 2:
                products = page2Products;
                break;
            case 3:
                products = page3Products;
                break;
            default:
                products = [];
        }

        return HttpResponse.json({
            facets: mockFacets,
            products,
            pagination: {
                hasNext: page < 3,
                hasPrev: page > 1,
                limit: 20,
                page,
                total: 60,
                totalPages: 3,
            },
        });
    }),

    lastPage: http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
            facets: mockFacets,
            products: mockProducts,
            pagination: {
                hasNext: false,
                hasPrev: false,
                limit: 20,
                page: 1,
                total: 20,
                totalPages: 1,
            },
        });
    }),
});
