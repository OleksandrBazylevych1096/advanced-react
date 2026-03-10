import {Suspense} from "react";
import {Navigate, Route, Routes} from "react-router";

import {PageLoader} from "@/widgets/PageLoader";

import {LanguageSyncWrapper} from "./LanguageSyncWrapper";
import {useMissingLanguageRedirect} from "./lib/useMissingLanguageRedirect";
import {routeConfig} from "./routerConfig";

export const AppRouter = () => {
    const missingLanguageRedirectPath = useMissingLanguageRedirect();

    if (missingLanguageRedirectPath) {
        return <Navigate to={missingLanguageRedirectPath} replace />;
    }

    return (
        <Routes>
            {routeConfig.map(({path, element, hasLocalizedParams}) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <LanguageSyncWrapper hasLocalizedParams={hasLocalizedParams}>
                            <Suspense fallback={<PageLoader />}>{element}</Suspense>
                        </LanguageSyncWrapper>
                    }
                />
            ))}
        </Routes>
    );
};
