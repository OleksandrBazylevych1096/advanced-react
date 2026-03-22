import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {AuthByGoogleButton} from "@/features/auth/auth-by-google";
import {FormSteps, RegisterForm, useRegisterFlow} from "@/features/auth/register";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./RegisterPage.module.scss";

export const RegisterPageContent = () => {
    const {t} = useTranslation("auth");
    const {step, goToPreviousStep} = useRegisterFlow();
    const getLocalizedPath = useLocalizedRoutePath();

    const titleByStep = {
        [FormSteps.CREDENTIALS]: t("register.credentials.title"),
        [FormSteps.PASSWORD]: t("register.password.title"),
        [FormSteps.VERIFICATION]: t("register.verification.title"),
    } as const;
    const title = titleByStep[step];
    const isCredentialsStep = step === FormSteps.CREDENTIALS;

    return (
        <Stack gap={16}>
            {!isCredentialsStep && (
                <Button
                    className={styles.backButton}
                    onClick={goToPreviousStep}
                    theme="tertiary"
                    size="md"
                    form="circle"
                    aria-label={t("common.back")}
                >
                    <AppIcon Icon={ArrowLeft} />
                </Button>
            )}
            <Stack gap={8}>
                <Typography as="h1" variant="display" weight="semibold">
                    {title}
                </Typography>
            </Stack>
            <RegisterForm />
            {isCredentialsStep && (
                <>
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
                    <Typography
                        as="span"
                        className={styles.footer}
                        variant="bodySm"
                        weight="semibold"
                    >
                        {t("register.alreadyHaveAccount")}{" "}
                        <Link
                            className={styles.link}
                            to={getLocalizedPath(routePaths[AppRoutes.LOGIN])}
                        >
                            <Typography as="span" variant="bodySm" weight="semibold" tone="primary">
                                {t("login.signIn")}
                            </Typography>
                        </Link>
                    </Typography>
                </>
            )}
        </Stack>
    );
};
