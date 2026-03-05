import type {Product} from "@/entities/product";

import {baseAPI} from "@/shared/api";
import {type SupportedLngsType} from "@/shared/config";

interface ProductBySlugArgs {
    slug: string;
    locale: SupportedLngsType;
}

const productPageApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getProductBySlug: build.query<Product, ProductBySlugArgs>({
            query: ({slug, locale}) => ({
                url: `/products/slug/${slug}`,
                params: {locale},
            }),
        }),
    }),
});

export const {useGetProductBySlugQuery} = productPageApi;
