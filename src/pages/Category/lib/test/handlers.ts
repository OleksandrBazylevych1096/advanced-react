import {delay, http, HttpResponse} from 'msw';

import {mockCategories} from "@/entities/category/lib/test/mockData.ts";

import {API_URL} from "@/shared/config";


export const breadcrumbsHandlers = {
    default:
        http.get(`${API_URL}/categories/breadcrumbs/:slug`, () => {
            return HttpResponse.json(mockCategories);
        }),
    loading:
        http.get(`${API_URL}/categories/breadcrumbs/:slug`, async () => {
            await delay('infinite')
            return HttpResponse.json(mockCategories);
        }),
    error:
        http.get(`${API_URL}/categories/breadcrumbs/:slug`, () => {
            return HttpResponse.json(
                {error: 'Failed to load breadcrumbs'},
                {status: 500}
            );
        }),
};

