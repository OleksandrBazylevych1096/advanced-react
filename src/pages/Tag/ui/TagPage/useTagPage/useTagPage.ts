import {useParams} from "react-router";

import {useResolvedTagId} from "@/entities/tag";

import type {SupportedLngsType} from "@/shared/config";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedSlugSync} from "@/shared/lib/routing";

export const useTagPage = () => {
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();
    const {
        data: {tag, resolvedTagId},
        status: {isLoading: isTagLoading, isSuccess: isTagSuccess},
    } = useResolvedTagId({
        slug,
        locale: lng,
    });

    useLocalizedSlugSync({
        languageParam: lng,
        slugMap: tag?.slugMap,
        enabled: isTagSuccess,
        routePath: routePaths[AppRoutes.TAG],
    });

    const breadcrumbs = tag ? [{label: tag.name}] : [];

    return {
        data: {breadcrumbs, tagId: resolvedTagId},
        status: {
            isLoading: isTagLoading,
        },
    };
};
