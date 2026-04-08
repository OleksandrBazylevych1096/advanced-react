import {useTranslation} from "react-i18next";

import styles from "@/pages/settings/Security/ui/SettingsSecurityPage/SettingsSecurityPage.module.scss";

import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useUnlinkGoogle} from "./useUnlinkGoogle/useUnlinkGoogle.ts";

export const UnlinkGoogle = () => {
    const {t} = useTranslation();
    const {
        status: {isLoading, error, isSuccess},
        actions: {unlink},
    } = useUnlinkGoogle();

    return (
        <Stack gap={12} className={styles.securityBlock}>
            <Typography as="h2" variant="heading" weight="semibold">
                {t("settings.pages.security.unlinkGoogle")}
            </Typography>
            <Button
                type="button"
                theme="outline"
                isLoading={isLoading}
                onClick={() => void unlink()}
            >
                {t("settings.pages.security.unlinkGoogle")}
            </Button>
            {isSuccess && (
                <Typography variant="bodySm" tone="success" weight="semibold">
                    {t("settings.pages.security.unlinkGoogleSuccess")}
                </Typography>
            )}
            {error && (
                <Typography variant="bodySm" tone="danger" weight="semibold">
                    {error}
                </Typography>
            )}
        </Stack>
    );
};
