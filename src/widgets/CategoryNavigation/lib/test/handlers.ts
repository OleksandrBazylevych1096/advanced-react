import {delay, http, HttpResponse} from 'msw';

import {API_URL} from "@/shared/config";

import {mockCategoryNavigation} from './mockData';

export const categoryNavigationHandlers = {
    default:
        http.get(`${API_URL}/categories/navigation/:slug`, () => {
            return HttpResponse.json(mockCategoryNavigation.topLevel);
        }),


    subcategories:
        http.get(`${API_URL}/categories/navigation/:slug`, () => {
            return HttpResponse.json(mockCategoryNavigation.withSubcategories);
        }),


    loading:
        http.get(`${API_URL}/categories/navigation/:slug`, async () => {
            await delay('infinite');
            return HttpResponse.json(mockCategoryNavigation.topLevel);
        }),


    error:
        http.get(`${API_URL}/categories/navigation/:slug`, () => {
            return HttpResponse.json(
                {error: 'Failed to load category navigation'},
                {status: 500}
            );
        }),


};