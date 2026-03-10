import {Suspense} from "react";
import {Navigate, Route, Routes, useLocation} from "react-router";

import {PageLoader} from "@/widgets/PageLoader";

import {LanguageSyncWrapper} from "./LanguageSyncWrapper";
import {useMissingLanguageRedirect} from "./lib/useMissingLanguageRedirect";
import {routeConfig} from "./routerConfig";

export const AppRouter = () => {
    const missingLanguageRedirectPath = useMissingLanguageRedirect();
    const location = useLocation();

    if (missingLanguageRedirectPath) {
        return <Navigate to={missingLanguageRedirectPath} replace />;
    }

    return (
        <Suspense key={location.key} fallback={<PageLoader />}>
            <Routes>
                {routeConfig.map(({path, element, hasLocalizedParams}) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <LanguageSyncWrapper hasLocalizedParams={hasLocalizedParams}>
                                {element}
                            </LanguageSyncWrapper>
                        }
                    />
                ))}
            </Routes>
        </Suspense>
    );
};
