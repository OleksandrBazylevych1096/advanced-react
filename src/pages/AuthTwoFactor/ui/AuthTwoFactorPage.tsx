import {useTranslation} from "react-i18next";

import {AuthTwoFactorChallenge} from "@/features/auth/auth-two-factor-challenge";

import {AppPage} from "@/shared/ui/AppPage";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./AuthTwoFactorPage.module.scss";

const AuthTwoFactorPage = () => {
    const {t} = useTranslation("auth");

    return (
        <AppPage className={styles.pageWrapper}>
            <Stack className={styles.page} gap={16}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("twoFactor.title")}
                </Typography>
                <AuthTwoFactorChallenge />
            </Stack>
        </AppPage>
    );
};

export default AuthTwoFactorPage;
