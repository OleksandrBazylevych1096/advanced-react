import type {ComponentType, ReactNode} from "react";
import type {RouteProps} from "react-router";

import {SettingsPageLayout} from "@/app/layouts/SettingsPageLayout/SettingsPageLayout";

import {AuthCallbackPage} from "@/pages/AuthCallbackPage";
import {AuthTwoFactorPage} from "@/pages/AuthTwoFactor";
import {CartPage} from "@/pages/Cart";
import {CategoryPage} from "@/pages/Category";
import {CheckoutPage} from "@/pages/Checkout";
import {CheckoutResultPage} from "@/pages/CheckoutResult";
import {ForgotPasswordPage} from "@/pages/ForgotPassword";
import {HomePage} from "@/pages/Home";
import {LoginPage} from "@/pages/Login";
import {NotFoundPage} from "@/pages/NotFound";
import {OrderPage} from "@/pages/Order";
import {ProductPage} from "@/pages/Product";
import {RegisterPage} from "@/pages/Register";
import {ResetPasswordPage} from "@/pages/ResetPassword";
import {SearchPage} from "@/pages/Search";
import {SettingsAddressPage} from "@/pages/settings/Address";
import {SettingsNotificationsPage} from "@/pages/settings/Notifications";
import {SettingsOrdersPage} from "@/pages/settings/Orders";
import {SettingsSecurityPage} from "@/pages/settings/Security";

import {AppRoutes, routePaths} from "@/shared/config";

export type AppRouteConfig = RouteProps & {
    layout?: ComponentType<{children: ReactNode}> | null;
    hasLocalizedParams?: boolean;
    requiresAuth?: boolean;
};

export const routeConfig: AppRouteConfig[] = [
    {
        path: routePaths[AppRoutes.HOME],
        element: <HomePage />,
    },
    {
        path: routePaths[AppRoutes.LOGIN],
        element: <LoginPage />,
        layout: null,
    },
    {
        path: routePaths[AppRoutes.REGISTER],
        element: <RegisterPage />,
        layout: null,
    },
    {
        path: routePaths[AppRoutes.AUTH_CALLBACK],
        element: <AuthCallbackPage />,
        layout: null,
    },
    {
        path: routePaths[AppRoutes.AUTH_2FA],
        element: <AuthTwoFactorPage />,
        layout: null,
    },
    {
        path: routePaths[AppRoutes.FORGOT_PASSWORD],
        element: <ForgotPasswordPage />,
        layout: null,
    },
    {
        path: routePaths[AppRoutes.RESET_PASSWORD],
        element: <ResetPasswordPage />,
        layout: null,
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
        path: routePaths[AppRoutes.SEARCH],
        element: <SearchPage />,
    },
    {
        path: routePaths[AppRoutes.CART],
        element: <CartPage />,
    },
    {
        path: routePaths[AppRoutes.CHECKOUT],
        element: <CheckoutPage />,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.CHECKOUT_RESULT],
        element: <CheckoutResultPage />,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.ORDER],
        element: <OrderPage />,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.SETTINGS_ORDERS],
        element: <SettingsOrdersPage />,
        layout: SettingsPageLayout,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.SETTINGS_SECURITY],
        element: <SettingsSecurityPage />,
        layout: SettingsPageLayout,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.SETTINGS_ADDRESS],
        element: <SettingsAddressPage />,
        layout: SettingsPageLayout,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.SETTINGS_NOTIFICATIONS],
        element: <SettingsNotificationsPage />,
        layout: SettingsPageLayout,
        requiresAuth: true,
    },
    {
        path: routePaths[AppRoutes.NOT_FOUND],
        element: <NotFoundPage />,
        layout: null,
    },
];
