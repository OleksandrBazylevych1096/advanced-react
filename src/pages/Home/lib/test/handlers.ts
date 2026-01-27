import {delay, http, HttpResponse} from 'msw';

import {mockProducts} from "@/entities/product/lib/test/mockData.ts";

import {API_URL} from "@/shared/config";


export const firstOrderProductsHandlers = {
    default:
        http.get(`${API_URL}/products/first-order-discount`, () => {
            return HttpResponse.json(mockProducts.slice(0, 3));
        }),
    loading:
        http.get(`${API_URL}/products/first-order-discount`, async () => {
            await delay('infinite')
            return HttpResponse.json(mockProducts.slice(0, 3));
        }),
    error:
        http.get(`${API_URL}/products/first-order-discount`, () => {
            return HttpResponse.json(
                {error: 'Failed to load products'},
                {status: 500}
            );
        }),
};