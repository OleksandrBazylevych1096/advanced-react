import {type ReactNode, Suspense} from "react";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Route, Routes, useParams, useLocation, useNavigate} from "react-router";

import {PageLoader} from "@/widgets/PageLoader";

import type {SupportedLngsType} from "@/shared/config";
import {useLanguageSync} from "@/shared/lib";

import {routeConfig} from "../routerConfig";

const MissingLanguageRedirect = () => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const supportedLanguages = (i18n.options.supportedLngs || [])
            .filter((lng): lng is string => typeof lng === "string")
            .filter((lng) => lng !== "cimode");

        const pathnameSegments = location.pathname.split("/");
        const firstSegment = pathnameSegments[1];
        const hasLanguagePrefix = supportedLanguages.includes(firstSegment);

        if (hasLanguagePrefix) {
            return;
        }

        const fallbackConfig = i18n.options.fallbackLng;
        const fallbackLanguage =
            typeof fallbackConfig === "string"
                ? fallbackConfig
                : Array.isArray(fallbackConfig)
                  ? fallbackConfig[0]
                  : i18n.language;

        navigate(`/${fallbackLanguage}${location.pathname}${location.search}${location.hash}`, {
            replace: true,
        });
    }, [i18n, location.hash, location.pathname, location.search, navigate]);

    return null;
};

const LanguageSyncBoundary = ({children}: {children: ReactNode}) => {
    const {lng} = useParams<{lng?: SupportedLngsType}>();
    useLanguageSync({languageParam: lng});

    return <>{children}</>;
};

export const AppRouter = () => {
    return (
        <>
            <MissingLanguageRedirect />
            <Routes>
                {routeConfig.map(({path, element}) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <LanguageSyncBoundary>
                                <Suspense key={path} fallback={<PageLoader />}>
                                    {element}
                                </Suspense>
                            </LanguageSyncBoundary>
                        }
                    />
                ))}
            </Routes>
        </>
    );
};
