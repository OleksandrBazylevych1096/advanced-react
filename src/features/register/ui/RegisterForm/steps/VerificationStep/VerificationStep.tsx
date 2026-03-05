import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {AppRoutes, routePaths} from "@/shared/config";
import {Button, Spinner, OTPInput, Typography} from "@/shared/ui";

import {useVerificationStepController} from "../../../../model/controllers/useVerificationStepController/useVerificationStepController";

import styles from "./VerificationStep.module.scss";

export const VerificationStep = () => {
    const {t} = useTranslation("auth");
    const {
        data: {email, phone, verificationRequired},
        derived: {isPhoneVerification, isEmailVerification},
        status: {error, isLoading},
        actions: {submitVerification, resendCode, resetFlow},
    } = useVerificationStepController();

    if (verificationRequired === null) {
        return (
            <div className={styles.form}>
                <Typography as="div" className={styles.title} variant="body" tone="muted">
                    {t("register.success.none", {
                        defaultValue: "Account created successfully.",
                    })}
                </Typography>
                <Link className={styles.link} to={routePaths[AppRoutes.LOGIN]}>
                    <Typography as="span" variant="body" tone="primary" weight="semibold">
                        {t("login.signIn")}
                    </Typography>
                </Link>
            </div>
        );
    }

    return (
        <>
            <form className={styles.form}>
                <Typography as="div" className={styles.title} variant="body" tone="muted">
                    {t("register.verification.sentTo")} <br />
                    <Typography as="span" variant="body" tone="default" weight="semibold">
                        {email || phone}
                    </Typography>
                </Typography>
                {(isPhoneVerification || isEmailVerification) && (
                    <OTPInput
                        length={4}
                        disabled={isLoading}
                        error={!!error}
                        onComplete={submitVerification}
                    />
                )}
                {error && (
                    <Typography
                        className={styles.error}
                        variant="bodySm"
                        tone="danger"
                        weight="semibold"
                    >
                        {error}
                    </Typography>
                )}
                {isLoading && (
                    <div className={styles.wrapper}>
                        <Spinner size="md" />
                    </div>
                )}
            </form>
            <div className={styles.resendCodeText}>
                <span>{t("register.verification.codeNotReceived")}</span>
                <Button
                    onClick={resendCode}
                    type="button"
                    disabled={isLoading}
                    className={styles.resendCodeButton}
                    theme="ghost"
                >
                    <Typography as="span" variant="body" tone="primary" weight="semibold">
                        {t("register.verification.resend")}
                    </Typography>
                </Button>
            </div>
            <Button onClick={resetFlow} theme="ghost" className={styles.resendCodeButton}>
                <Typography as="span" variant="body" tone="primary" weight="semibold">
                    {t("register.verification.changeContact", {
                        defaultValue: "Change contact",
                    })}
                </Typography>
            </Button>
        </>
    );
};
