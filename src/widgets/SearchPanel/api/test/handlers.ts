import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {mockPopularSearches, mockSearchHistoryItems} from "./mockData";

const baseSearchHistoryHandlers = createHandlers({
    endpoint: `${API_URL}/products/search-history`,
    method: "get",
    defaultData: mockSearchHistoryItems,
    errorData: {error: "Failed to load history"},
});

export const searchHistoryHandlers = extendHandlers(baseSearchHistoryHandlers, {
    empty: http.get(`${API_URL}/products/search-history`, () => {
        return HttpResponse.json([]);
    }),
});

const basePopularSearchesHandlers = createHandlers({
    endpoint: `${API_URL}/products/search-history/popular`,
    method: "get",
    defaultData: mockPopularSearches,
    errorData: {error: "Failed to load popular searches"},
});

export const popularSearchesHandlers = extendHandlers(basePopularSearchesHandlers, {
    empty: http.get(`${API_URL}/products/search-history/popular`, () => {
        return HttpResponse.json([]);
    }),
});
