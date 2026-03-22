import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router";

import {ResetPasswordForm} from "@/features/auth/reset-password";

import {AppPage} from "@/shared/ui/AppPage";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./ResetPasswordPage.module.scss";

const ResetPasswordPage = () => {
    const {t} = useTranslation("auth");
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return (
        <AppPage className={styles.pageWrapper}>
            <Stack className={styles.page} gap={16}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("resetPassword.title")}
                </Typography>
                <ResetPasswordForm token={token} />
            </Stack>
        </AppPage>
    );
};

export default ResetPasswordPage;
