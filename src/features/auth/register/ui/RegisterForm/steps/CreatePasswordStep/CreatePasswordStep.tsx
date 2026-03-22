import type {FormEvent} from "react";
import {useTranslation} from "react-i18next";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import CheckIcon from "@/shared/assets/icons/Check.svg?react";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Input} from "@/shared/ui/Input";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {useCreatePasswordStepController} from "../../../../model/controllers/useCreatePasswordStepController/useCreatePasswordStepController";

import styles from "./CreatePasswordStep.module.scss";

export const CreatePasswordStep = () => {
    const {t} = useTranslation("auth");
    const {
        data: {password},
        derived: {passwordRequirementsState},
        status: {error, isLoading, passwordErrorText, isPasswordValid},
        actions: {changePassword, submitPassword},
    } = useCreatePasswordStepController();
    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await submitPassword();
    };

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input
                disabled={isLoading}
                label={t("register.password.title")}
                type="password"
                errorText={passwordErrorText}
                className={styles.input}
                placeholder={t("register.password.enterPassword")}
                onChange={changePassword}
                value={password}
            />
            <Stack className={styles.requirementsList} gap={6}>
                {passwordRequirementsState.map((requirement) => {
                    return (
                        <Stack
                            key={requirement.key}
                            className={styles.requirement}
                            direction="row"
                            align="center"
                            gap={8}
                        >
                            <AppIcon
                                size={16}
                                className={cn(styles.requirementIcon, {
                                    [styles.met]: requirement.isMet,
                                })}
                                Icon={CheckIcon}
                            />
                            <Typography
                                as="span"
                                className={styles.requirementText}
                                variant="bodySm"
                                weight="semibold"
                                tone="muted"
                            >
                                {t(requirement.key)}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
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
            <Button
                className={styles.button}
                disabled={!isPasswordValid}
                isLoading={isLoading}
                type="submit"
                fullWidth
                size="md"
            >
                {t("register.continueButton")}
                <AppIcon Icon={ArrowRight} />
            </Button>
        </form>
    );
};
