import type {FormEvent} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib";
import {Button, Grid, Input, Stack, Typography} from "@/shared/ui";

import {useForgotPasswordFormController} from "../../model/controllers/useForgotPasswordFormController";

import styles from "./ForgotPasswordForm.module.scss";

export const ForgotPasswordForm = () => {
    const {t} = useTranslation("auth");
    const getLocalizedPath = useLocalizedRoutePath();
    const {
        data: {identifier, isSuccess},
        status: {isLoading, error, fieldError},
        actions: {changeIdentifier, submit},
    } = useForgotPasswordFormController();

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submit();
    };

    return (
        <Grid as="form" onSubmit={submitForm} gap={12}>
            <Input
                label={t("forgotPassword.emailLabel")}
                type="email"
                value={identifier}
                onChange={changeIdentifier}
                error={Boolean(fieldError)}
                errorText={fieldError}
                disabled={isLoading}
                placeholder={t("forgotPassword.emailPlaceholder")}
            />
            {error && (
                <Typography variant="bodySm" tone="danger" weight="semibold">
                    {error}
                </Typography>
            )}
            {isSuccess && (
                <Typography variant="bodySm" tone="success" weight="semibold">
                    {t("forgotPassword.success")}
                </Typography>
            )}
            <Stack className={styles.actions} direction="row" gap={12} align="center" wrap="wrap">
                <Button type="submit" isLoading={isLoading}>
                    {t("forgotPassword.submit")}
                </Button>
                <Link className={styles.link} to={getLocalizedPath(routePaths[AppRoutes.LOGIN])}>
                    <Typography as="span" variant="bodySm" tone="primary" weight="semibold">
                        {t("forgotPassword.backToLogin")}
                    </Typography>
                </Link>
            </Stack>
        </Grid>
    );
};
