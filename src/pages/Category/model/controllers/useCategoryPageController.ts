import {skipToken} from "@reduxjs/toolkit/query";
import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery, useResolvedCategoryIdController} from "@/entities/category";

import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";
import {useLocalizedSlugSync} from "@/shared/lib/routing/localizedSlug/useSlugSync.ts";

export const useCategoryPageController = () => {
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();
    const {
        data: {category, resolvedCategoryId},
        status: {isSuccess: isCategorySuccess},
    } = useResolvedCategoryIdController({
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

    return createControllerResult({
        data: {
            breadcrumbs,
            categoryId: category?.id,
        },
    });
};
