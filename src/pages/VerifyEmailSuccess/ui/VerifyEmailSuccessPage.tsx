import {Link} from "react-router";
import {useTranslation} from "react-i18next";

import {AppRoutes, routePaths} from "@/shared/config";
import {AppPage, Button, Stack, Typography} from "@/shared/ui";

import styles from "./VerifyEmailSuccessPage.module.scss";

const VerifyEmailSuccessPage = () => {
    const {t} = useTranslation("auth");

    return (
        <AppPage>
            <Stack className={styles.page} gap={12}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("verifyEmail.successTitle")}
                </Typography>
                <Typography variant="body" tone="muted">
                    {t("verifyEmail.successDescription")}
                </Typography>
                <Link className={styles.buttonLink} to={routePaths[AppRoutes.LOGIN]}>
                    <Button type="button">{t("verifyEmail.goToLogin")}</Button>
                </Link>
            </Stack>
        </AppPage>
    );
};

export default VerifyEmailSuccessPage;
