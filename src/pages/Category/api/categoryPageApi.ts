import {generatePath} from "react-router";

import type {BaseCategory} from "@/entities/category/model/types/Category.ts";

import {baseAPI} from "@/shared/api";
import {routePaths} from "@/shared/config";
import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

interface CategoryBreadcrumbsArgs {
    slug: string
    locale: string
}

const categoryPageApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCategoryBreadcrumbs: build.query<BreadcrumbItem[], CategoryBreadcrumbsArgs>({
            query: ({locale, slug}) => ({
                url: `/categories/breadcrumbs/${slug}`,
                params: {locale},
            }),
            transformResponse(breadcrumbsData: BaseCategory[]): BreadcrumbItem[] {
                return breadcrumbsData.map((item) => ({
                    label: item.name,
                    href: generatePath(routePaths.category, {slug: item.slug})
                }));
            }
        }),


    }),

})


export const {useGetCategoryBreadcrumbsQuery} =
    categoryPageApi;
