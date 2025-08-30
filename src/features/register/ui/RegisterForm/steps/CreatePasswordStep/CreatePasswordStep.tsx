import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { passwordRequirements } from "@/features/register/config/passwordRequirements";
import { selectRegisterEmail } from "@/features/register/model/selectors/selectRegisterEmail/selectRegisterEmail";
import { selectRegisterIsLoading } from "@/features/register/model/selectors/selectRegisterIsLoading/selectRegisterIsLoading";
import { selectRegisterPassword } from "@/features/register/model/selectors/selectRegisterPassword/selectRegisterPassword";
import { selectRegisterPhone } from "@/features/register/model/selectors/selectRegisterPhone/selectRegisterPhone.ts";
import { register } from "@/features/register/model/services/register";
import { registerActions } from "@/features/register/model/slice/registerSlice";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import CheckIcon from "@/shared/assets/icons/Check.svg?react";
import { cn, useAppDispatch, useAppSelector } from "@/shared/lib";
import { AppIcon, Button, Input } from "@/shared/ui";

import styles from "./CreatePasswordStep.module.scss";

export const CreatePasswordStep = () => {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();

  const [validationError, setValidationError] = useState(false);

  const email = useAppSelector(selectRegisterEmail);
  const phone = useAppSelector(selectRegisterPhone);
  const isLoading = useAppSelector(selectRegisterIsLoading);
  const password = useAppSelector(selectRegisterPassword);

  const handleChangePassword = (value: string) => {
    dispatch(registerActions.setPassword(value));

    const isValid = passwordRequirements.every((requirement) =>
      requirement.test(value)
    );

    if (!isValid) {
      setValidationError(true);
    } else {
      setValidationError(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validationError) {
      dispatch(register({ email, phone, password }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        disabled={isLoading}
        label={t("register.password.title")}
        type="password"
        className={styles.input}
        placeholder={t("register.password.enterPassword")}
        onChange={handleChangePassword}
        value={password}
      />
      <div className={styles.requirementsList}>
        {passwordRequirements.map((requirement) => {
          const isMet = requirement.test(password);
          return (
            <div key={requirement.key} className={styles.requirement}>
              <AppIcon
                size={16}
                className={cn(styles.requirementIcon, {
                  [styles.met]: isMet,
                })}
                Icon={CheckIcon}
              />
              <span className={styles.requirementText}>
                {t(requirement.key)}
              </span>
            </div>
          );
        })}
      </div>
      <Button
        className={styles.button}
        disabled={validationError}
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
