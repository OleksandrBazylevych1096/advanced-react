import type {Category} from "@/entities/category";

import {baseAPI} from "@/shared/api";


interface CategoryNavigationArgs {
    locale: string;
    slug?: string
}

interface CategoryNavigationReturn {
    currentCategory: Category
    parentCategory: Category
    items: Category[]
    isShowingSubcategories: boolean
}


const categoryNavigationApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({

        getCategoryNavigation: build.query<CategoryNavigationReturn, CategoryNavigationArgs>({
            query: ({slug, locale}) => ({
                url: `categories/navigation/${slug}`,
                params: {locale},
            }),
        }),
    }),
});

export const {useGetCategoryNavigationQuery} = categoryNavigationApi;
