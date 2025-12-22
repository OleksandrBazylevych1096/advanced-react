import type {Tag} from "@/entities/tag";

import {baseAPI} from "@/shared/api";

interface TrendingTagQueryArgs {
    locale: string;
}


const trendingProductsApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getTrendingProductTags: build.query<Tag[], TrendingTagQueryArgs>({
            query: (params) => ({
                url: "/tags/popular",
                params,
            }),
        }),

    }),
});

export const {
    useGetTrendingProductTagsQuery,
} = trendingProductsApi;
