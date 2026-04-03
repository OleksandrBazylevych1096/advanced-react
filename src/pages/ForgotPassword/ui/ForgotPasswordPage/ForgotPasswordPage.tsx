import {useTranslation} from "react-i18next";

import {AppPage} from "@/shared/ui/AppPage";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {ForgotPasswordForm} from "../ForgotPasswordForm/ForgotPasswordForm";

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
