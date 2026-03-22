import {baseAPI, type ApiLocaleParams} from "@/shared/api";
import type {BreadcrumbItem} from "@/shared/ui/Breadcrumbs";

import {generateCategoryHref} from "../lib/generateCategoryHref";
import type {BaseCategory, Category} from "../model/types/Category";

type CategoryBySlugArgs = ApiLocaleParams & {
    slug: string;
};

type CategoryBreadcrumbsArgs = ApiLocaleParams & {
    id: string;
};

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
