import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {AuthByGoogleButton} from "@/features/auth/auth-by-google";
import {LoginForm} from "@/features/auth/login";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppPage} from "@/shared/ui/AppPage";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./LoginPage.module.scss";

const LoginPage = () => {
    const {t} = useTranslation("auth");
    const getLocalizedPath = useLocalizedRoutePath();

    return (
        <AppPage className={styles.wrapper}>
            <Stack gap={16}>
                <Typography as="h1" variant="display" weight="semibold">
                    {t("login.signIn")}
                </Typography>
                <LoginForm />
                <Stack
                    className={styles.divider}
                    direction="row"
                    gap={16}
                    align="center"
                    justify="center"
                >
                    <div className={styles.line} />
                    <Typography
                        as="span"
                        className={styles.dividerText}
                        variant="bodySm"
                        weight="medium"
                        tone="muted"
                    >
                        {t("or")}
                    </Typography>
                    <div className={styles.line} />
                </Stack>
                <Stack direction="row" gap={16} align="center" justify="center">
                    <AuthByGoogleButton />
                </Stack>
                <Typography as="span" className={styles.footer} variant="bodySm" weight="semibold">
                    {t("login.dontHaveAccount")}{" "}
                    <Link
                        className={styles.link}
                        to={getLocalizedPath(routePaths[AppRoutes.REGISTER])}
                    >
                        <Typography as="span" variant="bodySm" weight="semibold" tone="primary">
                            {t("register.signUp")}
                        </Typography>
                    </Link>
                </Typography>
            </Stack>
        </AppPage>
    );
};

export default LoginPage;
