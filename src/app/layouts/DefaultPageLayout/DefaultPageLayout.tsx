import type {ReactNode} from "react";

import {Footer} from "@/widgets/Footer";

import {AppPage} from "@/shared/ui/AppPage";

import {AppHeader} from "../AppHeader/AppHeader";

interface DefaultPageLayoutProps {
    children: ReactNode;
}

export const DefaultPageLayout = ({children}: DefaultPageLayoutProps) => {
    return (
        <AppPage>
            <AppHeader />
            <AppPage.Content>{children}</AppPage.Content>
            <Footer />
        </AppPage>
    );
};
