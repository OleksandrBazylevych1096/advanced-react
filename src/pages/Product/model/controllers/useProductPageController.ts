import {useParams} from "react-router";

import {useGetCategoryBreadcrumbsQuery} from "@/pages/Category/api/categoryPageApi.ts";
import {useGetProductBySlugQuery} from "@/pages/Product/api/productPageApi.ts";
import {generateProductBreadcrumbs} from "@/pages/Product/lib/generateProductBreadcrumbs/generateProductBreadcrumbs.ts";

import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";
import {useSlugSync} from "@/shared/lib/routing/localizedSlug/useSlugSync.ts";

export const useProductPageController = () => {
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();

    const {
        data: product,
        isSuccess,
        isFetching,
        isError,
    } = useGetProductBySlugQuery({slug: slug!, locale: lng!});

    const {data: categoryBreadcrumbs} = useGetCategoryBreadcrumbsQuery(
        {
            id: product?.categoryId,
            locale: lng!,
        },
        {skip: !product?.categoryId},
    );

    const breadcrumbs = generateProductBreadcrumbs(categoryBreadcrumbs, product?.name);

    useSlugSync({
        languageParam: lng,
        slugMap: product?.slugMap,
        enabled: isSuccess,
        routePath: routePaths[AppRoutes.PRODUCT],
    });

    return createControllerResult({
        data: {
            product,
        },
        derived: {
            breadcrumbs,
        },
        status: {
            isFetching: isFetching,
            isError: isError,
        },
    });
};
