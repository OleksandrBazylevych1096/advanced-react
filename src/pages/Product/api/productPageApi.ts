import type {Product} from "@/entities/product";

import {baseAPI, type ApiLocaleParams} from "@/shared/api";

type ProductBySlugArgs = ApiLocaleParams & {
    slug: string;
};

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
