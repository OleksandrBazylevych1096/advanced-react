import {Link, useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";

import {AppRoutes, routePaths} from "@/shared/config";
import {AppPage, Button, Stack, Typography} from "@/shared/ui";

import styles from "./VerifyEmailErrorPage.module.scss";

const VerifyEmailErrorPage = () => {
    const {t} = useTranslation("auth");
    const [searchParams] = useSearchParams();
    const reason = searchParams.get("reason") ?? "unknown";

    return (
        <AppPage>
            <Stack className={styles.page} gap={12}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("verifyEmail.errorTitle")}
                </Typography>
                <Typography variant="body" tone="muted">
                    {t("verifyEmail.errorReason", {reason})}
                </Typography>
                <Stack direction="row" gap={12} align="center" wrap="wrap">
                    <Link className={styles.buttonLink} to={routePaths[AppRoutes.LOGIN]}>
                        <Button type="button">{t("verifyEmail.login")}</Button>
                    </Link>
                    <Link className={styles.link} to={routePaths[AppRoutes.REGISTER]}>
                        <Typography as="span" variant="bodySm" weight="semibold" tone="primary">
                            {t("verifyEmail.registerAgain")}
                        </Typography>
                    </Link>
                </Stack>
            </Stack>
        </AppPage>
    );
};

export default VerifyEmailErrorPage;
