import type {FormEvent} from "react";
import {useTranslation} from "react-i18next";

import {methodKeyMap, otpLengthMap} from "@/features/auth/auth-two-factor-challenge/config/consts.ts";

import {Button} from "@/shared/ui/Button";
import {Input, OTPInput} from "@/shared/ui/Input";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useAuthTwoFactorChallengeController} from "../../state/controllers/useAuthTwoFactorChallengeController";

import styles from "./AuthTwoFactorChallenge.module.scss";

export const AuthTwoFactorChallenge = () => {
    const {t} = useTranslation("auth");
    const {
        data: {pendingMfaChallenge, availableMethods, selectedMethod, backupCode, otpSent},
        derived: {isOtpMethod},
        status: {error, isLoading},
        actions: {changeMethod, changeBackupCode, clearError, sendOtp, submit, goToLogin},
    } = useAuthTwoFactorChallengeController();

    const submitForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await submit();
    };

    if (!pendingMfaChallenge) {
        return (
            <Stack className={styles.container} gap={12}>
                <Typography variant="body" tone="muted">
                    {t("twoFactor.missingChallenge")}
                </Typography>
                <Button type="button" onClick={goToLogin}>
                    {t("twoFactor.backToLogin")}
                </Button>
            </Stack>
        );
    }

    const isBackupCode = selectedMethod === "backup_code";
    const showOtpInput = !isBackupCode && (!isOtpMethod || otpSent);

    return (
        <Stack as="form" onSubmit={submitForm} className={styles.container} gap={12}>
            <Typography variant="body" tone="muted">
                {t("twoFactor.subtitle")}
            </Typography>

            <div className={styles.methods}>
                {availableMethods.map((method) => (
                    <Button
                        form="rounded"
                        key={method}
                        type="button"
                        theme={method === selectedMethod ? "outline" : "tertiary"}
                        onClick={() => changeMethod(method)}
                        disabled={isLoading}
                    >
                        {t(methodKeyMap[method])}
                    </Button>
                ))}
            </div>

            {showOtpInput && (
                <OTPInput
                    length={otpLengthMap[selectedMethod]}
                    disabled={isLoading}
                    error={Boolean(error)}
                    onChange={clearError}
                    onComplete={submit}
                    autoComplete="one-time-code"
                />
            )}

            {isBackupCode && (
                <Input
                    label={t("twoFactor.backupCodeLabel")}
                    value={backupCode}
                    onChange={changeBackupCode}
                    disabled={isLoading}
                    placeholder={t("twoFactor.backupCodePlaceholder")}
                />
            )}

            {error && (
                <Typography variant="bodySm" tone="danger" weight="semibold">
                    {error}
                </Typography>
            )}

            <Stack className={styles.actions} direction="row" gap={12} align="center" wrap="wrap">
                {isOtpMethod && (
                    <Button
                        type="button"
                        onClick={sendOtp}
                        theme={otpSent ? "tertiary" : "primary"}
                        isLoading={isLoading}
                    >
                        {otpSent ? t("twoFactor.resendCode") : t("twoFactor.sendCode")}
                    </Button>
                )}

                {isBackupCode && (
                    <Button type="submit" isLoading={isLoading}>
                        {t("twoFactor.verify")}
                    </Button>
                )}

                <Button type="button" theme="ghost" onClick={goToLogin} disabled={isLoading}>
                    {t("twoFactor.cancel")}
                </Button>
            </Stack>
        </Stack>
    );
};

