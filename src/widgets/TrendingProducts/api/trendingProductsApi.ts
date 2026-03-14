import type {Tag} from "@/entities/tag";

import {baseAPI, type ApiLocaleParams} from "@/shared/api";

const trendingProductsApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getTrendingProductTags: build.query<Tag[], ApiLocaleParams>({
            query: (params) => ({
                url: "/tags/popular",
                params,
            }),
        }),
    }),
});

export const {useGetTrendingProductTagsQuery} = trendingProductsApi;
