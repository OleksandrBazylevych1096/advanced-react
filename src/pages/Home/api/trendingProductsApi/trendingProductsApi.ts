import {baseAPI, type ApiLocaleParams} from "@/shared/api";

import type {Tag} from "../../model/types/Tag";

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
