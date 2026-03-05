import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery} from "@/pages/Category/api/categoryPageApi.ts";

import {useGetCategoryBySlugQuery} from "@/entities/category";

import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";
import {
    useLocalizedSlugSync,
} from "@/shared/lib/routing/localizedSlug/useSlugSync.ts";

export const useCategoryPageController = () => {
    const {slug, lng} = useParams<{ slug: string; lng: SupportedLngsType }>();
    const {data: category, isSuccess} = useGetCategoryBySlugQuery({slug: slug!, locale: lng!})
    const {data: breadcrumbs} = useGetCategoryBreadcrumbsQuery({
        id: category?.id,
        locale: lng!
    }, {skip: !category?.id})

    useLocalizedSlugSync({
        languageParam: lng,
        slugMap: category?.slugMap,
        enabled: isSuccess,
        routePath: routePaths[AppRoutes.CATEGORY]
    });

    return createControllerResult({
        data: {
            breadcrumbs,
            categoryId: category?.id,
        },
    });
};

