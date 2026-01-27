import {delay, http, HttpResponse} from 'msw';

import {mockFacets, mockProducts} from "@/entities/product/lib/test/mockData.ts";

import {API_URL} from "@/shared/config";


export const bestSellingProductsHandlers = {
    default:
        http.get(`${API_URL}/products/best-sellers`, () => {
            return HttpResponse.json({
                facets: mockFacets,
                products: mockProducts,
                total: 50,
                page: 1,
                limit: 20,
            });
        }),


    loading:
        http.get(`${API_URL}/products/best-sellers`, async () => {

            await delay('infinite');
            return HttpResponse.json({
                facets: mockFacets,
                products: mockProducts,
                total: 50,
                page: 1,
                limit: 20,
            });
        }),


    error:
        http.get(`${API_URL}/products/best-sellers`, () => {
            return HttpResponse.json(
                {error: 'Failed to load products'},
                {status: 500}
            );
        }),


};