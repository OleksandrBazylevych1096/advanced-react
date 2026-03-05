import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import MailIcon from "@/shared/assets/icons/Mail.svg?react";
import PhoneIcon from "@/shared/assets/icons/Phone.svg?react";
import {AppRoutes, AuthMethod, routePaths} from "@/shared/config";
import {AppIcon, Button, Input, PhoneInput, Tabs, Typography} from "@/shared/ui";
import "react-international-phone/style.css";

import {useLoginFormController} from "../../model/controllers/useLoginFormController";

import styles from "./LoginForm.module.scss";

export const LoginForm = () => {
    const {t} = useTranslation("auth");
    const {
        data: {email, phone, password, method},
        derived: {isEmailNotVerified},
        status: {isLoading, error, fieldErrors},
        actions: {changeEmail, changePhone, changePassword, switchAuthMethod, submitForm},
    } = useLoginFormController();

    return (
        <form onSubmit={submitForm} className={styles.form}>
            <Tabs onChange={switchAuthMethod} defaultValue={method}>
                <Tabs.List>
                    <Tabs.Trigger value={AuthMethod.EMAIL} data-testid="email-tab">
                        <AppIcon Icon={MailIcon} />
                        {t("login.email")}
                    </Tabs.Trigger>
                    <Tabs.Trigger value={AuthMethod.PHONE} data-testid="phone-tab">
                        <AppIcon Icon={PhoneIcon} />
                        {t("login.phone")}
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={AuthMethod.EMAIL} data-testid="email-content">
                    <Input
                        label={t("login.email")}
                        disabled={isLoading}
                        error={!!fieldErrors?.email || !!error}
                        value={email}
                        onChange={changeEmail}
                        type="email"
                        className={styles.input}
                        placeholder={t("login.enterEmail")}
                        data-testid="email-input"
                    />
                </Tabs.Content>
                <Tabs.Content value={AuthMethod.PHONE} data-testid="phone-content">
                    <PhoneInput
                        label={t("login.phone")}
                        error={!!fieldErrors?.phone || !!error}
                        onChange={changePhone}
                        disabled={isLoading}
                        value={phone}
                        className={styles.input}
                        data-testid="phone-input"
                    />
                </Tabs.Content>
            </Tabs>
            <Input
                onChange={changePassword}
                label={t("login.password")}
                value={password}
                type="password"
                error={!!fieldErrors?.password}
                className={styles.input}
                placeholder={t("login.enterPassword")}
                disabled={isLoading}
                data-testid="password-input"
            />
            <div className={styles.meta}>
                <Link className={styles.link} to={routePaths[AppRoutes.FORGOT_PASSWORD]}>
                    <Typography as="span" variant="bodySm" weight="semibold" tone="primary">
                        {t("login.forgotPassword", {defaultValue: "Forgot password?"})}
                    </Typography>
                </Link>
            </div>
            {error && (
                <Typography
                    className={styles.error}
                    variant="bodySm"
                    tone="danger"
                    weight="semibold"
                    data-testid="error-message"
                >
                    {error}
                </Typography>
            )}
            {isEmailNotVerified && (
                <div className={styles.verifyEmailBox}>
                    <Typography variant="bodySm" tone="muted">
                        {t("login.verifyEmailHelp", {
                            defaultValue:
                                "Please check your email and use the verification link before signing in.",
                        })}
                    </Typography>
                </div>
            )}
            <Button
                isLoading={isLoading}
                fullWidth
                type="submit"
                className={styles.button}
                size="md"
                data-testid="submit-button"
            >
                {t("login.loginButton")}
                <AppIcon Icon={ArrowRight} />
            </Button>
        </form>
    );
};
