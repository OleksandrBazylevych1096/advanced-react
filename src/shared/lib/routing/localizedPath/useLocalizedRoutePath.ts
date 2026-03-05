import {useTranslation} from "react-i18next";
import {generatePath, useParams} from "react-router";

import type {SupportedLngsType} from "@/shared/config";

type PathParams = Record<string, string | number | boolean>;

export const useLocalizedRoutePath = () => {
    const {i18n} = useTranslation();
    const {lng} = useParams<{lng?: SupportedLngsType}>();
    const currentLanguage = (lng || i18n.language) as SupportedLngsType;

    return (path: string, params?: PathParams) => {
        return generatePath(path, {
            lng: currentLanguage,
            ...(params || {}),
        });
    };
};
