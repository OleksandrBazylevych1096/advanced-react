import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {useGetCategoryNavigationQuery} from "@/widgets/CategoryNavigation/api/categoryNavigationApi.ts";

import type {SupportedLngsType} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";

export const useCategoryNavigationController = () => {
    const {i18n} = useTranslation();
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();
    const locale = (lng || i18n.language) as SupportedLngsType;

    const {data, isLoading, isError, refetch} = useGetCategoryNavigationQuery(
        {
            slug,
            locale,
        },
        {skip: !locale},
    );

    return createControllerResult({
        data: {data},
        status: {isLoading, isError},
        actions: {refetch},
    });
};
