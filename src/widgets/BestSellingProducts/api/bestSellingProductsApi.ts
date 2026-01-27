import type {ProductsApiResponse} from "@/entities/product";

import {baseAPI} from "@/shared/api";
import type {CurrencyType, SupportedLngsType} from "@/shared/config";

interface Args {
    locale: SupportedLngsType;
    currency: CurrencyType;
}

const bestSellingProductsApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getBestSellingProducts: build.query<ProductsApiResponse, Args>({
            query: (params) => ({
                url: "/products/best-sellers",
                params,
            }),
        }),
    }),
});

export const {useGetBestSellingProductsQuery} = bestSellingProductsApi;
