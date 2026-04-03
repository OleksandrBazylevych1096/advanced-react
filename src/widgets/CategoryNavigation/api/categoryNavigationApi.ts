import type {Category} from "@/entities/category";

import {baseAPI, type ApiLocaleParams} from "@/shared/api";
import {filterParams} from "@/shared/lib/validation";

interface CategoryNavigationArgs extends ApiLocaleParams {
    slug?: string;
    searchQuery?: string;
}

export interface CategoryNavigationReturn {
    currentCategory: Category | null;
    parentCategory: Category | null;
    items: Category[];
    isShowingSubcategories: boolean;
}

export const categoryNavigationApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCategoryNavigation: build.query<CategoryNavigationReturn, CategoryNavigationArgs>({
            query: ({slug, searchQuery, locale}) => ({
                url: "/categories/navigation",
                params: filterParams({slug, search: searchQuery, locale}),
            }),
        }),
    }),
});

export const {useGetCategoryNavigationQuery} = categoryNavigationApi;
