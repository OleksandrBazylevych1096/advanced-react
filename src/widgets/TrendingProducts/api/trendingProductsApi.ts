import type {Tag} from "@/entities/tag";

import {baseAPI} from "@/shared/api";
import type {SupportedLngsType} from "@/shared/config";

interface TrendingTagQueryArgs {
    locale: SupportedLngsType;
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
