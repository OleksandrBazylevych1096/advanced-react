import type {ReactNode} from "react";

import {Header} from "@/widgets/Header/ui/Header/Header.tsx";
import {SettingsSidebar} from "@/widgets/SettingsSidebar";

import {AppPage} from "@/shared/ui/AppPage";
import {Stack} from "@/shared/ui/Stack";

import styles from "./SettingsPageLayout.module.scss";

interface SettingsPageLayoutProps {
    children: ReactNode;
}

export const SettingsPageLayout = ({children}: SettingsPageLayoutProps) => {
    return (
        <AppPage>
            <Header />
            <AppPage.Content>
                <Stack as="section" direction={"row"} gap={12}>
                    <SettingsSidebar />
                    <div className={styles.content}>{children}</div>
                </Stack>
            </AppPage.Content>
        </AppPage>
    );
};
