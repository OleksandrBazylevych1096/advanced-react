import {delay, http, HttpResponse} from 'msw';

import {API_URL} from "@/shared/config";

import {emptyFacets, mockFacets, mockProducts} from './mockData';

export const productsHandlers = {
    default:
        http.get(`${API_URL}/products`, () => {

            return HttpResponse.json({
                facets: mockFacets,
                products: mockProducts,
                total: 50,
            });
        }),


    withFilters:
        http.get(`${API_URL}/products`, () => {

            return HttpResponse.json({
                facets: mockFacets,
                products: mockProducts,
                total: 25,

            });
        }),


    loading:
        http.get(`${API_URL}/products`, async () => {
            await delay('infinite');
            return HttpResponse.json({
                facets: mockFacets,
                products: mockProducts,
                total: 50,

            });
        }),


    error:
        http.get(`${API_URL}/products`, () => {
            return HttpResponse.json(
                {error: 'Failed to load products'},
                {status: 500}
            );
        }),


    withEuroCurrency:
        http.get(`${API_URL}/products`, () => {
            const euroProducts = mockProducts.map(p => ({
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

    empty:
        http.get(`${API_URL}/products`, () => {
            return HttpResponse.json({
                facets: emptyFacets,
                products: [],
                total: 0,

            });
        }),

};