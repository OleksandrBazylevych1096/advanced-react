import {Navigate, Route, Routes} from "react-router";

import {routeConfig} from "./routerConfig";
import {buildRouteElement} from "./utils/buildRouteElement";
import {useMissingLanguageRedirect} from "./utils/useMissingLanguageRedirect";

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
