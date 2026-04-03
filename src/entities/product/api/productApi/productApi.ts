import {baseAPI} from "@/shared/api";
import {filterParams} from "@/shared/lib/validation";

import type {ProductQuery, ProductsApiResponse} from "../../model/types/Product";

export const productApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getInfiniteProducts: build.infiniteQuery<ProductsApiResponse, ProductQuery, number>({
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

            query: ({queryArg, pageParam}) => {
                const {searchQuery, ...restQueryArg} = queryArg;

                return {
                    url: "/products",
                    params: filterParams({
                        ...restQueryArg,
                        ...(searchQuery ? {q: searchQuery} : {}),
                        page: pageParam,
                        limit: queryArg.limit || 20,
                    }),
                };
            },
        }),
        getProducts: build.query<ProductsApiResponse, ProductQuery>({
            query: (params) => {
                const {searchQuery, ...restParams} = params;

                return {
                    url: "/products",
                    params: filterParams({
                        ...restParams,
                        ...(searchQuery ? {q: searchQuery} : {}),
                    }),
                };
            },
        }),
    }),
});

export const {
    useGetInfiniteProductsInfiniteQuery: useGetInfiniteProducts,
    useGetProductsQuery: useGetProducts,
} = productApi;
