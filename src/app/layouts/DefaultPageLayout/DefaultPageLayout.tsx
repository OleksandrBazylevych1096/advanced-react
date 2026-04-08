import type {ReactNode} from "react";

import {Footer} from "@/widgets/Footer";
import {Header} from "@/widgets/Header";

import {AppPage} from "@/shared/ui/AppPage";

interface DefaultPageLayoutProps {
    children: ReactNode;
}

export const DefaultPageLayout = ({children}: DefaultPageLayoutProps) => {
    return (
        <AppPage>
            <Header />
            <AppPage.Content>{children}</AppPage.Content>
            <Footer />
        </AppPage>
    );
};
