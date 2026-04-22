import {baseAPI, type ApiLocaleParams} from "@/shared/api";

import type {Tag} from "../model/types/Tag";

type TagBySlugArgs = ApiLocaleParams & {
    slug: string;
};

export const tagApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getTagBySlug: build.query<Tag, TagBySlugArgs>({
            query: ({slug, locale}) => ({
                url: `/tags/slug/${slug}`,
                params: {locale},
            }),
        }),
    }),
});

export const {useGetTagBySlugQuery} = tagApi;
