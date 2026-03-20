import {skipToken} from "@reduxjs/toolkit/query";

import type {SupportedLngsType} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";

import {useGetCategoryBySlugQuery} from "../../api/categoryApi";

interface UseResolvedCategoryIdArgs {
    categoryId?: string;
    slug?: string;
    locale?: SupportedLngsType;
}

export const useResolvedCategoryIdController = ({
    categoryId,
    slug,
    locale,
}: UseResolvedCategoryIdArgs) => {
    const shouldResolveCategoryBySlug = !categoryId && Boolean(slug && locale);
    const categoryQueryArgs =
        shouldResolveCategoryBySlug && slug && locale ? {slug, locale} : skipToken;

    const {
        currentData: category,
        isLoading: isCategoryLoading,
        isSuccess: isCategorySuccess,
        error: categoryError,
    } = useGetCategoryBySlugQuery(categoryQueryArgs);

    return createControllerResult({
        data: {
            category,
            resolvedCategoryId: categoryId ?? category?.id,
        },
        status: {
            isLoading: isCategoryLoading,
            isSuccess: isCategorySuccess,
            error: categoryError,
        },
    });
};
