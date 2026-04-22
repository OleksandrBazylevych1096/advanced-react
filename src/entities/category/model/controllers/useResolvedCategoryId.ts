import {skipToken} from "@reduxjs/toolkit/query";

import type {SupportedLngsType} from "@/shared/config";

import {useGetCategoryBySlugQuery} from "../../api/categoryApi";

interface UseResolvedCategoryIdArgs {
    categoryId?: string | null;
    slug?: string;
    locale?: SupportedLngsType;
    skip?: boolean;
}

export const useResolvedCategoryId = ({
    categoryId,
    slug,
    locale,
    skip = false,
}: UseResolvedCategoryIdArgs) => {
    const shouldResolveCategoryBySlug = !skip && !categoryId && Boolean(slug && locale);
    const categoryQueryArgs =
        shouldResolveCategoryBySlug && slug && locale ? {slug, locale} : skipToken;

    const {
        currentData: category,
        isLoading: isCategoryLoading,
        isSuccess: isCategorySuccess,
        error: categoryError,
    } = useGetCategoryBySlugQuery(categoryQueryArgs);

    return {
        data: {
            category,
            resolvedCategoryId: categoryId ?? category?.id,
        },
        status: {
            isLoading: isCategoryLoading,
            isSuccess: isCategorySuccess,
            error: categoryError,
        },
    };
};
