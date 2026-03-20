import {Navigate, Route, Routes} from "react-router";

import {buildRouteElement} from "./lib/buildRouteElement";
import {useMissingLanguageRedirect} from "./lib/useMissingLanguageRedirect";
import {routeConfig} from "./routerConfig";

export const AppRouter = () => {
    const missingLanguageRedirectPath = useMissingLanguageRedirect();

    if (missingLanguageRedirectPath) {
        return <Navigate to={missingLanguageRedirectPath} replace />;
    }

    return (
        <Routes>
            {routeConfig.map((route) => (
                <Route key={route.path} path={route.path} element={buildRouteElement(route)} />
            ))}
        </Routes>
    );
};
