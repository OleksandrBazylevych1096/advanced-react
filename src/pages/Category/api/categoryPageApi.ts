import {generatePath} from "react-router";

import type {BaseCategory, Category} from "@/entities/category/model/types/Category.ts";

import {baseAPI} from "@/shared/api";
import {routePaths, type SupportedLngsType} from "@/shared/config";
import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

interface CategoryBreadcrumbsArgs {
    slug: string
    locale: SupportedLngsType
}

interface CategoryBySlugArgs {
    slug: string
    locale: SupportedLngsType
}


const categoryPageApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCategoryBreadcrumbs: build.query<BreadcrumbItem[], CategoryBreadcrumbsArgs>({
            query: ({locale, slug}) => ({
                url: `/categories/breadcrumbs/${slug}`,
                params: {locale},
            }),
            transformResponse(breadcrumbsData: BaseCategory[], _meta, args): BreadcrumbItem[] {
                return breadcrumbsData.map((item) => ({
                    label: item.name,
                    href: generatePath(routePaths.category, {slug: item.slug, lng: args.locale})
                }));
            }
        }),
        getCategoryBySlug: build.query<Category, CategoryBySlugArgs>({
            query: ({slug, locale}) => ({
                url: `/categories/slug/${slug}`,
                params: {locale},
            }),

        }),

    }),

})


export const {useGetCategoryBreadcrumbsQuery, useGetCategoryBySlugQuery} =
    categoryPageApi;
