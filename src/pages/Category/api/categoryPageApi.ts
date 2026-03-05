import {generatePath} from "react-router";

import type {BaseCategory} from "@/entities/category";

import {baseAPI} from "@/shared/api";
import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";
import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs/Breadcrumbs.tsx";

interface CategoryBreadcrumbsArgs {
    id?: string;
    locale: SupportedLngsType;
}

const categoryPageApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCategoryBreadcrumbs: build.query<BreadcrumbItem[], CategoryBreadcrumbsArgs>({
            query: ({locale, id}) => ({
                url: `/categories/breadcrumbs/${id}`,
                params: {locale},
            }),
            transformResponse(breadcrumbsData: BaseCategory[], _meta, args): BreadcrumbItem[] {
                return breadcrumbsData.map((item) => ({
                    label: item.name,
                    href: generatePath(routePaths[AppRoutes.CATEGORY], {slug: item.slug, lng: args.locale}),
                }));
            },
        }),
    }),
});
export const {useGetCategoryBreadcrumbsQuery} = categoryPageApi;
