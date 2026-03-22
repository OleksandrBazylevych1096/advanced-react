import type {FormEvent} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import CheckIcon from "@/shared/assets/icons/Check.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Grid} from "@/shared/ui/Grid";
import {Input} from "@/shared/ui/Input";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useResetPasswordFormController} from "../../model/controllers/useResetPasswordFormController/useResetPasswordFormController";

import styles from "./ResetPasswordForm.module.scss";

interface ResetPasswordFormProps {
    token: string | null;
}

export const ResetPasswordForm = ({token}: ResetPasswordFormProps) => {
    const {t} = useTranslation("auth");
    const getLocalizedPath = useLocalizedRoutePath();
    const {
        data: {newPassword, isSuccess, redirectCountdown},
        derived: {passwordRequirementsState},
        status: {isLoading, error, fieldError, hasToken, isPasswordValid},
        actions: {changeNewPassword, submit},
    } = useResetPasswordFormController(token);

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submit();
    };

    if (!hasToken) {
        return (
            <Stack gap={10}>
                <Typography variant="body" tone="muted">
                    {t("resetPassword.missingToken")}
                </Typography>
                <Link
                    className={styles.link}
                    to={getLocalizedPath(routePaths[AppRoutes.FORGOT_PASSWORD])}
                >
                    <Typography as="span" variant="bodySm" tone="primary" weight="semibold">
                        {t("resetPassword.requestNewLink")}
                    </Typography>
                </Link>
            </Stack>
        );
    }

    if (isSuccess) {
        return (
            <Stack gap={10}>
                <Typography variant="body" tone="muted">
                    {t("resetPassword.success")}
                </Typography>
                <Typography variant="body" tone="muted">
                    {t("resetPassword.redirectingIn", {seconds: redirectCountdown})}
                </Typography>
                <Link className={styles.link} to={getLocalizedPath(routePaths[AppRoutes.LOGIN])}>
                    <Typography as="span" variant="bodySm" tone="primary" weight="semibold">
                        {t("resetPassword.goToLogin")}
                    </Typography>
                </Link>
            </Stack>
        );
    }

    return (
        <Grid as="form" onSubmit={submitForm} gap={12}>
            <Input
                label={t("resetPassword.newPassword")}
                type="password"
                value={newPassword}
                onChange={changeNewPassword}
                error={Boolean(fieldError)}
                errorText={fieldError}
                disabled={isLoading}
            />
            <Stack gap={6}>
                {passwordRequirementsState.map((requirement) => (
                    <Stack key={requirement.key} direction="row" gap={8} align="center">
                        <AppIcon
                            size={16}
                            className={cn(styles.requirementIcon, {
                                [styles.met]: requirement.isMet,
                            })}
                            Icon={CheckIcon}
                        />
                        <Typography as="span" variant="bodySm" weight="semibold">
                            {t(requirement.key)}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
            {error && (
                <Typography variant="bodySm" tone="danger" weight="semibold">
                    {error}
                </Typography>
            )}
            <Stack className={styles.actions} direction="row" gap={12} align="center" wrap="wrap">
                <Button type="submit" isLoading={isLoading} disabled={!isPasswordValid}>
                    {t("resetPassword.submit")}
                </Button>
                <Link className={styles.link} to={getLocalizedPath(routePaths[AppRoutes.LOGIN])}>
                    <Typography as="span" variant="bodySm" tone="primary" weight="semibold">
                        {t("resetPassword.backToLogin")}
                    </Typography>
                </Link>
            </Stack>
        </Grid>
    );
};
