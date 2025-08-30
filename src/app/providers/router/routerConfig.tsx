import type { RouteProps } from "react-router";

import { AuthCallbackPage } from "@/pages/AuthCallbackPage";
import { HomePage } from "@/pages/Home";
import { LoginPage } from "@/pages/Login";
import { NotFoundPage } from "@/pages/NotFound";
import { RegisterPage } from "@/pages/Register";

import { AppRoutes, routePaths } from "@/shared/config";

export const routeConfig: RouteProps[] = [
  {
    path: routePaths[AppRoutes.HOME],
    element: <HomePage />,
  },
  {
    path: routePaths[AppRoutes.LOGIN],
    element: <LoginPage />,
  },
  {
    path: routePaths[AppRoutes.register],
    element: <RegisterPage />,
  },
  {
    path: routePaths[AppRoutes.AUTH_CALLBACK],
    element: <AuthCallbackPage />,
  },
  {
    path: routePaths[AppRoutes.NOT_FOUND],
    element: <NotFoundPage />,
  },
];
