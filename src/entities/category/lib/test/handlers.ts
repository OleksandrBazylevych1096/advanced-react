import {delay, http, HttpResponse} from 'msw';

import {API_URL} from "@/shared/config";

import {mockCategories} from './mockData';

export const categoryHandlers = {
    default:
        http.get(`${API_URL}/categories/slug/:slug`, () => {
            return HttpResponse.json(mockCategories[0]);
        }),


    loading:
        http.get(`${API_URL}/categories/slug/:slug`, async () => {
            await delay('infinite');
            return HttpResponse.json(mockCategories[0]);
        }),


    error:
        http.get(`${API_URL}/categories/slug/:slug`, () => {
            return HttpResponse.json(
                {error: 'Failed to load category'},
                {status: 500}
            );
        }),

};