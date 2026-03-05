import {useTranslation} from "react-i18next";

import {ManageSessions} from "@/features/manage-sessions";
import {SetupTwoFactorCard} from "@/features/setup-two-factor";
import {UnlinkGoogleButton} from "@/features/unlink-google";

import {AppPage, Stack, Typography} from "@/shared/ui";

import styles from "./SessionsPage.module.scss";

const SessionsPage = () => {
    const {t} = useTranslation("auth");

    return (
        <AppPage>
            <Stack className={styles.page} gap={16}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("sessions.title")}
                </Typography>
                <div className={styles.securityBlock}>
                    <SetupTwoFactorCard />
                </div>
                <div className={styles.securityBlock}>
                    <UnlinkGoogleButton />
                </div>
                <ManageSessions />
            </Stack>
        </AppPage>
    );
};

export default SessionsPage;
