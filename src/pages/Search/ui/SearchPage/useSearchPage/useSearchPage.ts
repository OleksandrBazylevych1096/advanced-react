import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {generatePath, useSearchParams} from "react-router";

import {MIN_SEARCH_QUERY_LENGTH, SEARCH_QUERY_PARAM} from "@/features/product-search";

import {useGetCategoryByIdQuery} from "@/entities/category";

import {AppRoutes, routePaths} from "@/shared/config";

import {buildSearchBreadcrumbs} from "../../../lib/buildSearchBreadcrumbs.ts";

export const useSearchPage = () => {
    const {i18n} = useTranslation();
    const [searchParams] = useSearchParams();

    const searchQuery = (searchParams.get(SEARCH_QUERY_PARAM) ?? "").trim();
    const categoryId = (searchParams.get("categoryId") ?? "").trim();
    const activeCategoryId = categoryId || undefined;
    const isValidSearch = searchQuery.length >= MIN_SEARCH_QUERY_LENGTH;

    const {data: categoryData, isLoading: isCategoryLoading} = useGetCategoryByIdQuery(
        {
            id: categoryId,
            locale: i18n.language,
        },
        {
            skip: !activeCategoryId || !isValidSearch,
        },
    );

    const searchRoute = generatePath(routePaths[AppRoutes.SEARCH], {lng: i18n.language});

    const breadcrumbs = useMemo(
        () =>
            buildSearchBreadcrumbs({
                isValidSearch,
                searchQuery,
                categoryLabel: activeCategoryId ? categoryData?.name : undefined,
                searchRoute,
            }),
        [activeCategoryId, categoryData?.name, isValidSearch, searchQuery, searchRoute],
    );

    return {
        data: {
            searchQuery,
            activeCategoryId,
            isValidSearch,
            breadcrumbs,
        },
        status: {
            isLoading: isCategoryLoading,
        },
    };
};
