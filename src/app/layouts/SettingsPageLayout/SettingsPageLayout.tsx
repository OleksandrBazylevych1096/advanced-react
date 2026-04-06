import type {ReactNode} from "react";

import {AppHeader} from "@/app/layouts/AppHeader/AppHeader.tsx";

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
            <AppHeader/>
            <AppPage.Content>
                <Stack as="section" direction={'row'} gap={12}>
                    <SettingsSidebar/>
                    <div className={styles.content}>{children}</div>
                </Stack>
            </AppPage.Content>
        </AppPage>
    );
};
