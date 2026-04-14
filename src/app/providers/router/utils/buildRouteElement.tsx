import {Suspense, type ReactNode} from "react";

import {DefaultPageLayout} from "@/app/layouts/DefaultPageLayout/DefaultPageLayout";

import {PageLoader} from "@/widgets/PageLoader";

import {LanguageSyncWrapper} from "../LanguageSyncWrapper";
import type {AppRouteConfig} from "../routerConfig";

import {RequireAuth} from "./RequireAuth";

export const buildRouteElement = ({
    element,
    path,
    layout,
    hasLocalizedParams,
    requiresAuth,
}: AppRouteConfig): ReactNode => {
    const isFullscreenLoader = layout === null;
    const routeElement = (
        <Suspense key={path} fallback={<PageLoader fullscreen={isFullscreenLoader} />}>
            <LanguageSyncWrapper hasLocalizedParams={hasLocalizedParams}>
                {element}
            </LanguageSyncWrapper>
        </Suspense>
    );

    const guardedElement = requiresAuth ? <RequireAuth>{routeElement}</RequireAuth> : routeElement;
    const RouteLayout = layout === undefined ? DefaultPageLayout : layout;

    if (RouteLayout === null) {
        return guardedElement;
    }

    return <RouteLayout>{guardedElement}</RouteLayout>;
};
