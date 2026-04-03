import {useTranslation} from "react-i18next";

import {AppPage} from "@/shared/ui/AppPage";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {ManageSessions} from "../ManageSessions/ManageSessions";
import {SetupTwoFactorCard} from "../SetupTwoFactorCard/SetupTwoFactorCard";
import {UnlinkGoogleButton} from "../UnlinkGoogleButton/UnlinkGoogleButton";

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
