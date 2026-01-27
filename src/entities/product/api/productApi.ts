import type {ProductsApiResponse} from "@/entities/product";
import type {ProductQuery} from "@/entities/product/model/types/Product.ts";

import {baseAPI} from "@/shared/api";


export const productApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getInfiniteProducts: build.infiniteQuery<
            ProductsApiResponse,
            ProductQuery,
            number
        >({
            infiniteQueryOptions: {
                initialPageParam: 1,

                getNextPageParam: (lastPage, allPages, lastPageParam) => {
                    const totalPages = Math.ceil(lastPage.total / allPages[0].products.length);

                    if (lastPageParam < totalPages) {
                        return lastPageParam + 1;
                    }

                },

                getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
                    return firstPageParam > 1 ? firstPageParam - 1 : undefined;
                },
            },

            query: ({queryArg, pageParam}) => ({
                url: '/products',
                params: {
                    ...queryArg,
                    page: pageParam,
                    limit: queryArg.limit || 20
                },
            }),

        }),
        getProducts: build.query<
            ProductsApiResponse,
            ProductQuery
        >({
            query: (params) => ({
                url: "/products",
                params,
            }),
        }),
    }),

})


export const {useGetInfiniteProductsInfiniteQuery: useGetInfiniteProducts, useGetProductsQuery: useGetProducts} =
    productApi;
