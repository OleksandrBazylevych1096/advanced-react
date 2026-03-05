import {baseAPI} from "@/shared/api";
import type {SupportedLngsType} from "@/shared/config";

import type {Category} from "../model/types/Category";

interface CategoryBySlugArgs {
    slug?: string;
    locale: SupportedLngsType;
}

const categoryApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCategoryBySlug: build.query<Category, CategoryBySlugArgs>({
            query: ({slug, locale}) => ({
                url: `/categories/slug/${slug}`,
                params: {locale},
            }),
        }),
    }),
});

export const {useGetCategoryBySlugQuery} = categoryApi;
