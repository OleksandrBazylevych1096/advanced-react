import {baseAPI} from "@/shared/api";

import type {SearchHistoryItem} from "../model/types/searchHistory";

interface SearchHistorySyncRequest {
    queries: string[];
}

interface SearchHistorySyncResponse {
    mergedCount: number;
    items: SearchHistoryItem[];
}

export const searchHistoryApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getSearchHistory: build.query<SearchHistoryItem[], void>({
            query: () => ({
                url: "/products/search-history",
            }),
            providesTags: ["ProductSearchHistory"],
        }),
        getPopularSearches: build.query<string[], void>({
            query: () => ({
                url: "/products/search-history/popular",
            }),
        }),
        syncSearchHistory: build.mutation<SearchHistorySyncResponse, SearchHistorySyncRequest>({
            query: (body) => ({
                url: "/products/search-history/sync",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ProductSearchHistory"],
        }),
        deleteSearchHistoryItem: build.mutation<{success: boolean}, string>({
            query: (id) => ({
                url: `/products/search-history/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProductSearchHistory"],
        }),
        clearSearchHistory: build.mutation<{deletedCount: number}, void>({
            query: () => ({
                url: "/products/search-history",
                method: "DELETE",
            }),
            invalidatesTags: ["ProductSearchHistory"],
        }),
    }),
});

export const {
    useGetSearchHistoryQuery,
    useGetPopularSearchesQuery,
    useSyncSearchHistoryMutation,
    useDeleteSearchHistoryItemMutation,
    useClearSearchHistoryMutation,
} = searchHistoryApi;
