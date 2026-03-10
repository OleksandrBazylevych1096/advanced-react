import {baseAPI} from "@/shared/api";
import type {SupportedLngsType} from "@/shared/config";
import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

import {generateCategoryHref} from "../lib/generateCategoryHref";
import type {BaseCategory, Category} from "../model/types/Category";

interface CategoryBySlugArgs {
    slug: string;
    locale: SupportedLngsType;
}

interface CategoryBreadcrumbsArgs {
    id: string;
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
        getCategoryBreadcrumbs: build.query<BreadcrumbItem[], CategoryBreadcrumbsArgs>({
            query: ({locale, id}) => ({
                url: `/categories/breadcrumbs/${id}`,
                params: {locale},
            }),
            transformResponse(breadcrumbsData: BaseCategory[], _meta, args): BreadcrumbItem[] {
                return breadcrumbsData.map((item) => ({
                    label: item.name,
                    href: generateCategoryHref(item.slug, args.locale),
                }));
            },
        }),
    }),
});

export const {useGetCategoryBySlugQuery, useGetCategoryBreadcrumbsQuery} = categoryApi;
