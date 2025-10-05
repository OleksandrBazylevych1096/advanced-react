import type { ProductsApiResponse } from "@/entities/product";
import type { Tag } from "@/entities/tag";

import { baseAPI } from "@/shared/api";
import type { CurrencyType } from "@/shared/config";

interface TrendingTagQueryArgs {
  locale: string;
}

interface TrendingProductsByTagQueryArgs {
  locale: string;
  currency: CurrencyType;
  tagId: string;
}

const trendingProductsApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getTrendingProductTags: build.query<Tag[], TrendingTagQueryArgs>({
      query: (params) => ({
        url: "/tags/popular",
        params,
      }),
    }),
    getTrendingProductsByTag: build.query<
      ProductsApiResponse,
      TrendingProductsByTagQueryArgs
    >({
      query: (params) => ({
        url: "/products",
        params,
      }),
    }),
  }),
});

export const {
  useGetTrendingProductTagsQuery,
  useGetTrendingProductsByTagQuery,
} = trendingProductsApi;
