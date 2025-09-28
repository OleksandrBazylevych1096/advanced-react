import type { ProductsApiResponse } from "@/entities/product";

import { baseAPI } from "@/shared/api";

const bestSellingProductsApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getBestSellingProducts: build.query<ProductsApiResponse, void>({
      query: () => ({
        url: "/products/best-sellers",
        
      }),
    }),
  }),
});

export const { useGetBestSellingProductsQuery } = bestSellingProductsApi;
