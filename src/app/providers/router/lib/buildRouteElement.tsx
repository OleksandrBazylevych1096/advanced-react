import {Suspense, type ReactNode} from "react";

import {DefaultPageLayout} from "@/app/layouts";

import {PageLoader} from "@/widgets/PageLoader/ui/PageLoader";

import {LanguageSyncWrapper} from "../LanguageSyncWrapper";
import type {AppRouteConfig} from "../routerConfig";

export const buildRouteElement = ({
    element,
    path,
    hasLocalizedParams,
    withoutDefaultLayout,
}: AppRouteConfig): ReactNode => {
    const pageElement = (
        <Suspense key={path} fallback={<PageLoader />}>
            <LanguageSyncWrapper hasLocalizedParams={hasLocalizedParams}>
                {element}
            </LanguageSyncWrapper>
        </Suspense>
    );

    if (withoutDefaultLayout) {
        return pageElement;
    }

    return <DefaultPageLayout>{pageElement}</DefaultPageLayout>;
};
