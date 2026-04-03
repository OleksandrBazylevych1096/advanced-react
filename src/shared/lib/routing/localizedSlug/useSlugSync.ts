import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {generatePath, useLocation, useNavigate, useParams} from "react-router";

import type {SupportedLngsType} from "@/shared/config";
import {usePrevious} from "@/shared/lib/react";

interface UseRouteLanguageSyncArgs {
    languageParam?: SupportedLngsType;
    hasLocalizedParams?: boolean;
}

interface UseLocalizedSlugSyncArgs {
    languageParam?: SupportedLngsType;
    slugMap?: Record<SupportedLngsType, string>;
    enabled: boolean;
    routePath: string;
    slugParamName?: string;
}

export const useLanguageSync = ({
    languageParam,
    hasLocalizedParams = false,
}: UseRouteLanguageSyncArgs) => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const currentLanguage = i18n.language as SupportedLngsType;
    const previousLanguageParam = usePrevious(languageParam);
    const isRouteSyncInitializedRef = useRef(false);
    const isUrlSyncInitializedRef = useRef(false);
    const previousLanguage = usePrevious(currentLanguage);

    useEffect(() => {
        if (!languageParam) return;

        const routeLanguageChanged = previousLanguageParam !== languageParam;

        if (!isRouteSyncInitializedRef.current) {
            isRouteSyncInitializedRef.current = true;
        } else if (!routeLanguageChanged) {
            return;
        }

        if (i18n.language !== languageParam) {
            void i18n.changeLanguage(languageParam);
        }
    }, [languageParam, i18n]);

    useEffect(() => {
        if (!languageParam || hasLocalizedParams) return;

        const languageChanged = previousLanguage !== currentLanguage;

        if (!isUrlSyncInitializedRef.current) {
            isUrlSyncInitializedRef.current = true;
            return;
        }

        if (!languageChanged || currentLanguage === languageParam) {
            return;
        }

        const languagePrefixRegExp = new RegExp(`^/${languageParam}(?=/|$)`);
        const pathname = location.pathname.replace(languagePrefixRegExp, `/${currentLanguage}`);

        if (pathname !== location.pathname) {
            navigate(`${pathname}${location.search}${location.hash}`, {replace: true});
        }
    }, [
        languageParam,
        currentLanguage,
        hasLocalizedParams,
        location.hash,
        location.pathname,
        location.search,
        navigate,
        previousLanguage,
    ]);
};

export const useLocalizedSlugSync = ({
    languageParam,
    slugMap,
    enabled,
    routePath,
    slugParamName = "slug",
}: UseLocalizedSlugSyncArgs) => {
    const navigate = useNavigate();
    const {i18n} = useTranslation();
    const params = useParams();
    const currentSlug = params[slugParamName];
    const previousSlug = usePrevious(currentSlug);

    useEffect(() => {
        if (!enabled || !slugMap) return;

        const currentLanguage = i18n.language as SupportedLngsType;
        const correctSlug = slugMap[currentLanguage];

        const slugChanged = previousSlug !== undefined && currentSlug !== previousSlug;

        if (slugChanged) {
            return;
        }

        const slugMatchesUrl = Object.values(slugMap).includes(currentSlug || "");

        if (!slugMatchesUrl) {
            return;
        }

        const needsUpdate =
            correctSlug && (correctSlug !== currentSlug || currentLanguage !== languageParam);

        if (needsUpdate) {
            const path = generatePath(routePath, {
                lng: currentLanguage,
                [slugParamName]: correctSlug,
            });
            navigate(path, {replace: true});
        }
    }, [
        enabled,
        slugMap,
        i18n.language,
        currentSlug,
        languageParam,
        navigate,
        routePath,
        slugParamName,
        previousSlug,
    ]);
};
