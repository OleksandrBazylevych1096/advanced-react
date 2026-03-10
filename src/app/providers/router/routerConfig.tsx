import type {RouteProps} from "react-router";

import {AuthCallbackPage} from "@/pages/AuthCallbackPage";
import {AuthTwoFactorPage} from "@/pages/AuthTwoFactor";
import {CartPage} from "@/pages/Cart";
import {CategoryPage} from "@/pages/Category";
import {ForgotPasswordPage} from "@/pages/ForgotPassword";
import {HomePage} from "@/pages/Home";
import {LoginPage} from "@/pages/Login";
import {NotFoundPage} from "@/pages/NotFound";
import {ProductPage} from "@/pages/Product";
import {RegisterPage} from "@/pages/Register";
import {ResetPasswordPage} from "@/pages/ResetPassword";
import {SessionsPage} from "@/pages/Sessions";
import {VerifyEmailErrorPage} from "@/pages/VerifyEmailError";
import {VerifyEmailSuccessPage} from "@/pages/VerifyEmailSuccess";

import {AppRoutes, routePaths} from "@/shared/config";

export type AppRouteConfig = RouteProps & {
    hasLocalizedParams?: boolean;
};

export const routeConfig: AppRouteConfig[] = [
    {
        path: routePaths[AppRoutes.HOME],
        element: <HomePage />,
    },
    {
        path: routePaths[AppRoutes.LOGIN],
        element: <LoginPage />,
    },
    {
        path: routePaths[AppRoutes.REGISTER],
        element: <RegisterPage />,
    },
    {
        path: routePaths[AppRoutes.AUTH_CALLBACK],
        element: <AuthCallbackPage />,
    },
    {
        path: routePaths[AppRoutes.AUTH_2FA],
        element: <AuthTwoFactorPage />,
    },
    {
        path: routePaths[AppRoutes.FORGOT_PASSWORD],
        element: <ForgotPasswordPage />,
    },
    {
        path: routePaths[AppRoutes.RESET_PASSWORD],
        element: <ResetPasswordPage />,
    },
    {
        path: routePaths[AppRoutes.VERIFY_EMAIL_SUCCESS],
        element: <VerifyEmailSuccessPage />,
    },
    {
        path: routePaths[AppRoutes.VERIFY_EMAIL_ERROR],
        element: <VerifyEmailErrorPage />,
    },
    {
        path: routePaths[AppRoutes.SESSIONS],
        element: <SessionsPage />,
    },
    {
        path: routePaths[AppRoutes.CATEGORY],
        element: <CategoryPage />,
        hasLocalizedParams: true,
    },
    {
        path: routePaths[AppRoutes.PRODUCT],
        element: <ProductPage />,
        hasLocalizedParams: true,
    },
    {
        path: routePaths[AppRoutes.CART],
        element: <CartPage />,
    },
    {
        path: routePaths[AppRoutes.NOT_FOUND],
        element: <NotFoundPage />,
    },
];
