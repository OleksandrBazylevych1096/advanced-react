import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

import type {Category} from "@/entities/category";

import {baseAPI, type ApiLocaleParams} from "@/shared/api";

interface CategoryNavigationArgs extends ApiLocaleParams {
    slug?: string;
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
            async queryFn({slug, locale}, _api, _extraOptions, baseQuery) {
                if (!slug) {
                    const topLevelResponse = await baseQuery({
                        url: "/categories/top-level",
                        params: {locale},
                    });

                    if (topLevelResponse.error) {
                        return {error: topLevelResponse.error as FetchBaseQueryError};
                    }

                    return {
                        data: {
                            currentCategory: null,
                            parentCategory: null,
                            items: topLevelResponse.data as Category[],
                            isShowingSubcategories: false,
                        },
                    };
                }

                const navigationResponse = await baseQuery({
                    url: `/categories/navigation/${slug}`,
                    params: {locale},
                });

                if (navigationResponse.error) {
                    return {error: navigationResponse.error as FetchBaseQueryError};
                }

                return {data: navigationResponse.data as CategoryNavigationReturn};
            },
        }),
    }),
});

export const {useGetCategoryNavigationQuery} = categoryNavigationApi;
