import type {ReactNode} from "react";
import {Navigate, generatePath, useLocation, useParams} from "react-router";

import {selectIsAuthenticated, selectIsSessionReady} from "@/entities/user";

import {AppRoutes, routePaths, supportedLngs, type SupportedLngsType} from "@/shared/config";
import {useAppSelector} from "@/shared/lib/state";

interface RequireAuthProps {
    children: ReactNode;
}

const fallbackLanguage = supportedLngs[0];

export const RequireAuth = ({children}: RequireAuthProps) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isSessionReady = useAppSelector(selectIsSessionReady);
    const {lng} = useParams<{lng: string}>();
    const location = useLocation();

    if (!isSessionReady) {
        return null;
    }

    if (isAuthenticated) {
        return children;
    }

    const localizedLanguage = supportedLngs.includes(lng as SupportedLngsType) ? lng : fallbackLanguage;
    const loginPath = generatePath(routePaths[AppRoutes.LOGIN], {lng: localizedLanguage});

    return <Navigate to={loginPath} replace state={{from: location}} />;
};
