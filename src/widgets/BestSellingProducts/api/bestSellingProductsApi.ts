import type {ProductsApiResponse} from "@/entities/product";

import {baseAPI, type ApiLocaleCurrencyParams} from "@/shared/api";

const bestSellingProductsApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getBestSellingProducts: build.query<ProductsApiResponse, ApiLocaleCurrencyParams>({
            query: (params) => ({
                url: "/products/best-sellers",
                params,
            }),
        }),
    }),
});

export const {useGetBestSellingProductsQuery} = bestSellingProductsApi;
