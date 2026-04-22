import {skipToken} from "@reduxjs/toolkit/query";

import type {SupportedLngsType} from "@/shared/config";

import {useGetTagBySlugQuery} from "../../api/tagApi";

interface UseResolvedTagIdArgs {
    tagId?: string | null;
    slug?: string;
    locale?: SupportedLngsType;
}

export const useResolvedTagId = ({tagId, slug, locale}: UseResolvedTagIdArgs) => {
    const shouldResolveTagBySlug = !tagId && Boolean(slug && locale);
    const tagQueryArgs = shouldResolveTagBySlug && slug && locale ? {slug, locale} : skipToken;

    const {
        currentData: tag,
        isLoading: isTagLoading,
        isSuccess: isTagSuccess,
        error: tagError,
    } = useGetTagBySlugQuery(tagQueryArgs);

    return {
        data: {
            tag,
            resolvedTagId: tagId ?? tag?.id,
        },
        status: {
            isLoading: isTagLoading,
            isSuccess: isTagSuccess,
            error: tagError,
        },
    };
};
