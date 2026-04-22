import {baseAPI} from "@/shared/api";
import {filterParams} from "@/shared/lib/validation";

import type {ProductQuery, ProductsApiResponse} from "../../model/types/Product";

const buildProductsQueryParams = (queryArg: ProductQuery, pageParam?: number) => {
    const {searchQuery, ...restQueryArg} = queryArg;

    return filterParams({
        ...restQueryArg,
        ...(searchQuery ? {q: searchQuery} : {}),
        ...(pageParam ? {page: pageParam} : {}),
        limit: queryArg.limit || 20,
    });
};

export const productApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getInfiniteProducts: build.infiniteQuery<ProductsApiResponse, ProductQuery, number>({
            infiniteQueryOptions: {
                initialPageParam: 1,

                getNextPageParam: (lastPage) => {
                    if (lastPage.pagination.hasNext) {
                        return lastPage.pagination.page + 1;
                    }
                },

                getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
                    return firstPageParam > 1 ? firstPageParam - 1 : undefined;
                },
            },

            query: ({queryArg, pageParam}) => ({
                url: "/products",
                params: buildProductsQueryParams(queryArg, pageParam),
            }),
        }),
        getInfiniteBestSellers: build.infiniteQuery<ProductsApiResponse, ProductQuery, number>({
            infiniteQueryOptions: {
                initialPageParam: 1,

                getNextPageParam: (lastPage) => {
                    if (lastPage.pagination.hasNext) {
                        return lastPage.pagination.page + 1;
                    }
                },

                getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
                    return firstPageParam > 1 ? firstPageParam - 1 : undefined;
                },
            },

            query: ({queryArg, pageParam}) => ({
                url: "/products/best-sellers",
                params: buildProductsQueryParams(queryArg, pageParam),
            }),
        }),
        getProducts: build.query<ProductsApiResponse, ProductQuery>({
            query: (params) => {
                return {
                    url: "/products",
                    params: buildProductsQueryParams(params),
                };
            },
        }),
    }),
});

export const {
    useGetInfiniteProductsInfiniteQuery: useGetInfiniteProducts,
    useGetInfiniteBestSellersInfiniteQuery: useGetInfiniteBestSellers,
    useGetProductsQuery: useGetProducts,
} = productApi;
