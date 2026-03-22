import {useTranslation} from "react-i18next";
import {useLocation} from "react-router";

import {isSupportedLanguage, getFallbackLanguage} from "@/shared/lib/i18n";

export const useMissingLanguageRedirect = () => {
    const {i18n} = useTranslation();
    const location = useLocation();

    const pathnameSegments = location.pathname.split("/");
    const firstSegment = pathnameSegments[1];
    const hasLanguagePrefix = isSupportedLanguage(firstSegment);

    if (hasLanguagePrefix) {
        return null;
    }

    const fallbackLanguage = getFallbackLanguage(i18n);

    return `/${fallbackLanguage}${location.pathname}${location.search}${location.hash}`;
};
