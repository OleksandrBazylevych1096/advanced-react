import {useTranslation} from "react-i18next";

import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {ManageSessions} from "../ManageSessions/ManageSessions";
import {SetupTwoFactorCard} from "../SetupTwoFactorCard/SetupTwoFactorCard";
import {UnlinkGoogle} from "../UnlinkGoogleButton/UnlinkGoogle.tsx";

import styles from "./SettingsSecurityPage.module.scss";

const SettingsSecurityPage = () => {
    const {t} = useTranslation();

    return (
        <Stack className={styles.page} gap={16}>
            <Typography as="h2" variant="heading" weight="semibold">
                {t("settings.pages.security.title")}
            </Typography>
            <SetupTwoFactorCard />
            <UnlinkGoogle />
            <ManageSessions />
        </Stack>
    );
};

export default SettingsSecurityPage;
