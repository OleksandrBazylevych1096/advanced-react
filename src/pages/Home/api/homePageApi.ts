import type {Product} from "@/entities/product";

import {baseAPI, type ApiLocaleCurrencyParams} from "@/shared/api";

const homePageApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getFirstOrderProducts: build.query<Product[], ApiLocaleCurrencyParams>({
            query: (params) => ({
                url: "/products/first-order-discount",
                params,
            }),
        }),
    }),
});

export const {useGetFirstOrderProductsQuery} = homePageApi;
