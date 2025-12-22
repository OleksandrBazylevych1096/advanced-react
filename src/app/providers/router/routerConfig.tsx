import type {RouteProps} from "react-router";

import {AuthCallbackPage} from "@/pages/AuthCallbackPage";
import {CategoryPage} from "@/pages/Category";
import {HomePage} from "@/pages/Home";
import {LoginPage} from "@/pages/Login";
import {NotFoundPage} from "@/pages/NotFound";
import {RegisterPage} from "@/pages/Register";

import {AppRoutes, routePaths} from "@/shared/config";

export const routeConfig: RouteProps[] = [
    {
        path: routePaths[AppRoutes.HOME],
        element: <HomePage/>,
    },
    {
        path: routePaths[AppRoutes.LOGIN],
        element: <LoginPage/>,
    },
    {
        path: routePaths[AppRoutes.REGISTER],
        element: <RegisterPage/>,
    },
    {
        path: routePaths[AppRoutes.AUTH_CALLBACK],
        element: <AuthCallbackPage/>,
    },
    {
        path: routePaths[AppRoutes.CATEGORY],
        element: <CategoryPage/>
    },
    {
        path: routePaths[AppRoutes.NOT_FOUND],
        element: <NotFoundPage/>,
    },
];
