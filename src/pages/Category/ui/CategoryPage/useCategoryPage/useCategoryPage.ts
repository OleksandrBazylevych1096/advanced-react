import {skipToken} from "@reduxjs/toolkit/query";
import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery, useResolvedCategoryId} from "@/entities/category";

import type {SupportedLngsType} from "@/shared/config";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedSlugSync} from "@/shared/lib/routing";

export const useCategoryPage = () => {
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();
    const {
        data: {category, resolvedCategoryId},
        status: {isLoading: isCategoryLoading, isSuccess: isCategorySuccess},
    } = useResolvedCategoryId({
        slug,
        locale: lng,
    });

    const categoryBreadcrumbsArgs =
        resolvedCategoryId && lng ? {id: resolvedCategoryId, locale: lng} : skipToken;
    const {data: breadcrumbs} = useGetCategoryBreadcrumbsQuery(categoryBreadcrumbsArgs);

    useLocalizedSlugSync({
        languageParam: lng,
        slugMap: category?.slugMap,
        enabled: isCategorySuccess,
        routePath: routePaths[AppRoutes.CATEGORY],
    });

    return {
        data: {
            breadcrumbs,
            categoryId: category?.id,
        },
        status: {
            isLoading: isCategoryLoading,
        },
    };
};
