import type {ReactNode} from "react";

import {Footer} from "@/widgets/Footer";

import {AppPage} from "@/shared/ui";

import {AppHeader} from "../../AppHeader/ui/AppHeader";

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
