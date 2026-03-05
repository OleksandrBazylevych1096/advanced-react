import {useTranslation} from "react-i18next";

import {ForgotPasswordForm} from "@/features/forgot-password";
import {AppPage, Stack, Typography} from "@/shared/ui";

import styles from "./ForgotPasswordPage.module.scss";

const ForgotPasswordPage = () => {
    const {t} = useTranslation("auth");

    return (
        <AppPage className={styles.pageWrapper}>
            <Stack className={styles.page} gap={16}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("forgotPassword.title")}
                </Typography>
                <ForgotPasswordForm />
            </Stack>
        </AppPage>
    );
};

export default ForgotPasswordPage;
