import {skipToken} from "@reduxjs/toolkit/query";
import {useParams} from "react-router";

import {useGetProductBySlugQuery} from "@/pages/Product/api/productPageApi.ts";
import {generateProductBreadcrumbs} from "@/pages/Product/lib/generateProductBreadcrumbs/generateProductBreadcrumbs.ts";

import {useGetCategoryBreadcrumbsQuery} from "@/entities/category";

import type {SupportedLngsType} from "@/shared/config";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedSlugSync} from "@/shared/lib/routing";

export const useProductPage = () => {
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();

    const {
        data: product,
        isSuccess,
        isFetching,
        isError,
    } = useGetProductBySlugQuery(slug && lng ? {slug, locale: lng} : skipToken);

    const categoryBreadcrumbsArgs =
        product?.categoryId && lng ? {id: product.categoryId, locale: lng} : skipToken;
    const {data: categoryBreadcrumbs} = useGetCategoryBreadcrumbsQuery(categoryBreadcrumbsArgs);

    const breadcrumbs = generateProductBreadcrumbs(categoryBreadcrumbs, product?.name);

    useLocalizedSlugSync({
        languageParam: lng,
        slugMap: product?.slugMap,
        enabled: isSuccess,
        routePath: routePaths[AppRoutes.PRODUCT],
    });

    return {
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
    };
};
