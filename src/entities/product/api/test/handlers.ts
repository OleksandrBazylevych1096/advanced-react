import {http, HttpResponse} from 'msw';

import {API_URL} from '@/shared/config';
import {createHandlers, extendHandlers} from "@/shared/lib/test/msw/createHandlers.ts";

import {createMockProduct, emptyFacets, mockFacets, mockProducts} from './mockData.ts';

const baseHandlers = createHandlers({
    endpoint: `${API_URL}/products`,
    method: 'get',
    defaultData: {
        facets: mockFacets,
        products: mockProducts,
        total: 50,
    },
    errorData: {error: 'Failed to load products'},
    errorStatus: 500,
});

const page2Products = createMockProduct.createList(20);
const page3Products = createMockProduct.createList(20);

export const productsHandlers = extendHandlers(baseHandlers, {
    withEuroCurrency: http.get(`${API_URL}/products`, () => {
        const euroProducts = mockProducts.map((p) => ({
            ...p,
            currency: 'EUR',
            price: Math.round(p.price * 0.92),
        }));

        return HttpResponse.json({
            facets: mockFacets,
            products: euroProducts,
            total: 50,
        });
    }),

    empty: http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
            facets: emptyFacets,
            products: [],
            total: 0,
        });
    }),

    withPagination: http.get(`${API_URL}/products`, ({request}) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);

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
            total: 60,
        });
    }),

    lastPage: http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
            facets: mockFacets,
            products: mockProducts,
            total: 20,
        });
    }),
});