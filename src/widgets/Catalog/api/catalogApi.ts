import type {ProductsApiResponse} from "@/entities/product";

import {baseAPI} from "@/shared/api";
import {type CurrencyType} from "@/shared/config";


interface ProductsByCategorySlugArgs {
    categorySlug: string
    locale: string,
    currency: CurrencyType
    limit: number
}


const catalogApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getProducts: build.infiniteQuery<
            ProductsApiResponse,
            ProductsByCategorySlugArgs,
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
                    categorySlug: queryArg.categorySlug,
                    locale: queryArg.locale,
                    currency: queryArg.currency,
                    page: pageParam,
                    limit: queryArg.limit,
                },
            }),

        }),
    }),

})


export const {useGetProductsInfiniteQuery} =
    catalogApi;
