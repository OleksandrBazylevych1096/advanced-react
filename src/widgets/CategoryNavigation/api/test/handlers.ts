import {http, HttpResponse} from 'msw';

import {API_URL} from '@/shared/config';
import {createHandlers, extendHandlers} from "@/shared/lib/test/msw/createHandlers.ts";

import {mockCategoryNavigation} from './mockData.ts';


const baseHandlers = createHandlers({
    endpoint: `${API_URL}/categories/navigation/:slug`,
    method: 'get',
    defaultData: mockCategoryNavigation.topLevel,
    errorData: {error: 'Failed to load category navigation'},
    errorStatus: 500,
});


export const categoryNavigationHandlers = extendHandlers(baseHandlers, {
    subcategories: http.get(`${API_URL}/categories/navigation/:slug`, () => {
        return HttpResponse.json(mockCategoryNavigation.withSubcategories);
    }),
    

    empty: http.get(`${API_URL}/categories/navigation/:slug`, () => {
        return HttpResponse.json(mockCategoryNavigation.empty);
    }),
});