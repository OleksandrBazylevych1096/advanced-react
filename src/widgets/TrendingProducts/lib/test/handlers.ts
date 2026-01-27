import {delay, http, HttpResponse} from 'msw';

import {mockTags} from "@/widgets/TrendingProducts/lib/test/mockData.ts";

import {API_URL} from "@/shared/config";


export const trendingProductsHandlers = {
    default:
        http.get(`${API_URL}/tags/popular`, () => {
            return HttpResponse.json(mockTags);
        }),
    loading:
        http.get(`${API_URL}/tags/popular`, async () => {
            await delay('infinite')
            return HttpResponse.json(mockTags);
        }),
    error:
        http.get(`${API_URL}/tags/popular`, () => {
            return HttpResponse.json(
                {error: 'Failed to load products'},
                {status: 500}
            );
        }),
};