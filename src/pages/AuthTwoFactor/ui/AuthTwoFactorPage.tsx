import {useTranslation} from "react-i18next";

import {AuthTwoFactorChallenge} from "@/features/auth-two-factor-challenge";

import {AppPage, Stack, Typography} from "@/shared/ui";

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
