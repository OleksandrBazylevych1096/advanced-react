import type {FormEvent} from "react";
import {useTranslation} from "react-i18next";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import MailIcon from "@/shared/assets/icons/Mail.svg?react";
import PhoneIcon from "@/shared/assets/icons/Phone.svg?react";
import {AuthMethod} from "@/shared/config";
import {AppIcon, Button, Input, PhoneInput, Tabs, Typography} from "@/shared/ui";

import {useCredentialsStepController} from "../../../../model/controllers/useCredentialsStepController/useCredentialsStepController";

import styles from "./CredentialsStep.module.scss";

export const CredentialsStep = () => {
    const {t} = useTranslation("auth");
    const {
        data: {method, email, phone},
        status: {error, emailErrorText, phoneErrorText},
        actions: {changeEmail, changePhone, switchMethod, submitCredentials},
    } = useCredentialsStepController();

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitCredentials();
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <Tabs onChange={switchMethod} defaultValue={method}>
                <Tabs.List>
                    <Tabs.Trigger value={AuthMethod.EMAIL}>
                        <AppIcon Icon={MailIcon} /> {t("register.credentials.email")}
                    </Tabs.Trigger>
                    <Tabs.Trigger value={AuthMethod.PHONE}>
                        <AppIcon Icon={PhoneIcon} />
                        {t("register.credentials.phone")}
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={AuthMethod.EMAIL}>
                    <Input
                        errorText={emailErrorText}
                        label={t("register.credentials.email")}
                        type="email"
                        onChange={changeEmail}
                        value={email}
                        placeholder={t("register.credentials.enterEmail")}
                    />
                </Tabs.Content>
                <Tabs.Content value={AuthMethod.PHONE}>
                    <PhoneInput
                        errorText={phoneErrorText}
                        label={t("register.credentials.phone")}
                        onChange={changePhone}
                        value={phone}
                    />
                </Tabs.Content>
            </Tabs>
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
            <Button className={styles.button} type="submit" fullWidth size="md">
                {t("register.continueButton")}
                <AppIcon Icon={ArrowRight} />
            </Button>
        </form>
    );
};
