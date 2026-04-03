import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppPage} from "@/shared/ui/AppPage";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./VerifyEmailSuccessPage.module.scss";

const VerifyEmailSuccessPage = () => {
    const {t} = useTranslation("auth");
    const getLocalizedPath = useLocalizedRoutePath();

    return (
        <AppPage>
            <Stack className={styles.page} gap={12}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("verifyEmail.successTitle")}
                </Typography>
                <Typography variant="body" tone="muted">
                    {t("verifyEmail.successDescription")}
                </Typography>
                <Link
                    className={styles.buttonLink}
                    to={getLocalizedPath(routePaths[AppRoutes.LOGIN])}
                >
                    <Button type="button">{t("verifyEmail.goToLogin")}</Button>
                </Link>
            </Stack>
        </AppPage>
    );
};

export default VerifyEmailSuccessPage;
