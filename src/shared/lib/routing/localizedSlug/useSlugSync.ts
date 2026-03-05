import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {generatePath, useLocation, useNavigate, useParams} from "react-router";

import type {SupportedLngsType} from "@/shared/config";

interface UseRouteLanguageSyncArgs {
    languageParam?: SupportedLngsType;
    slugParamName?: string;
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
    slugParamName = "slug",
}: UseRouteLanguageSyncArgs) => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const currentLanguage = i18n.language as SupportedLngsType;
    const hasSlugParam = Boolean(params[slugParamName]);
    const previousLanguageParamRef = useRef(languageParam);
    const isRouteSyncInitializedRef = useRef(false);
    const isUrlSyncInitializedRef = useRef(false);
    const previousLanguageRef = useRef(currentLanguage);

    useEffect(() => {
        if (!languageParam) return;

        const routeLanguageChanged = previousLanguageParamRef.current !== languageParam;
        previousLanguageParamRef.current = languageParam;

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
        if (!languageParam || hasSlugParam) return;

        const previousLanguage = previousLanguageRef.current;
        const languageChanged = previousLanguage !== currentLanguage;

        if (!isUrlSyncInitializedRef.current) {
            isUrlSyncInitializedRef.current = true;
            previousLanguageRef.current = currentLanguage;
            return;
        }

        if (!languageChanged || currentLanguage === languageParam) {
            previousLanguageRef.current = currentLanguage;
            return;
        }

        const languagePrefixRegExp = new RegExp(`^/${languageParam}(?=/|$)`);
        const pathname = location.pathname.replace(languagePrefixRegExp, `/${currentLanguage}`);

        if (pathname !== location.pathname) {
            navigate(`${pathname}${location.search}${location.hash}`, {replace: true});
        }

        previousLanguageRef.current = currentLanguage;
    }, [
        languageParam,
        currentLanguage,
        hasSlugParam,
        location.hash,
        location.pathname,
        location.search,
        navigate,
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

    const previousSlugRef = useRef(currentSlug);

    useEffect(() => {
        if (!enabled || !slugMap) return;

        const currentLanguage = i18n.language as SupportedLngsType;
        const correctSlug = slugMap[currentLanguage];

        const slugChanged = currentSlug !== previousSlugRef.current;

        if (slugChanged) {
            previousSlugRef.current = currentSlug;
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
    ]);
};
