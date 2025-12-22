import type {Product} from "@/entities/product";

import {baseAPI} from "@/shared/api";
import type {CurrencyType} from "@/shared/config";

interface FirstOrderProductsQueryArgs {
    locale: string;
    currency: CurrencyType;
}

const homePageApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getFirstOrderProducts: build.query<Product[], FirstOrderProductsQueryArgs>({
            query: (params) => ({
                url: "/products/first-order-discount",
                params: params,
            }),
        }),
    }),
});

export const {useGetFirstOrderProductsQuery} =
    homePageApi;
