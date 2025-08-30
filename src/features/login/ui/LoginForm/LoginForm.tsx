import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import MailIcon from "@/shared/assets/icons/Mail.svg?react";
import PhoneIcon from "@/shared/assets/icons/Phone.svg?react";
import { AuthMethod, routePaths } from "@/shared/config";
import { useAppDispatch, useAppSelector } from "@/shared/lib";
import { AppIcon, Button, Input, PhoneInput, Tabs } from "@/shared/ui";
import "react-international-phone/style.css";

import { selectLoginEmail } from "../../model/selectors/selectLoginEmail/selectLoginEmail";
import { selectLoginError } from "../../model/selectors/selectLoginError/selectLoginError";
import { selectLoginIsLoading } from "../../model/selectors/selectLoginIsLoading/selectLoginIsLoading";
import { selectLoginMethod } from "../../model/selectors/selectLoginMethod/selectLoginMethod";
import { selectLoginPassword } from "../../model/selectors/selectLoginPassword/selectLoginPassword";
import { selectLoginPhone } from "../../model/selectors/selectLoginPhone/selectLoginPhone";
import { login } from "../../model/services/login/login";
import { loginActions } from "../../model/slice/loginSlice";

import styles from "./LoginForm.module.scss";

export const LoginForm = () => {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const email = useAppSelector(selectLoginEmail);
  const phone = useAppSelector(selectLoginPhone);
  const password = useAppSelector(selectLoginPassword);
  const method = useAppSelector(selectLoginMethod);
  const isLoading = useAppSelector(selectLoginIsLoading);
  const error = useAppSelector(selectLoginError);

  const handleChangeEmail = (value: string) => {
    dispatch(loginActions.setEmail(value));
  };
  const handleChangePhone = (value: string) => {
    dispatch(loginActions.setPhone(value));
  };

  const handleChangePassword = (value: string) => {
    dispatch(loginActions.setPassword(value));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login({ email, phone, password }));

    if (login.fulfilled.match(result)) {
      navigate(routePaths.home);
    }
  };

  const handleTabChange = () => {
    dispatch(
      loginActions.setMethod(
        method === AuthMethod.EMAIL ? AuthMethod.PHONE : AuthMethod.EMAIL
      )
    );
    dispatch(loginActions.resetForm());
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <Tabs onChange={handleTabChange} defaultValue={method}>
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
            error={!!error}
            value={email}
            onChange={handleChangeEmail}
            type="email"
            className={styles.input}
            placeholder={t("login.enterEmail")}
            data-testid="email-input"
          />
        </Tabs.Content>
        <Tabs.Content value={AuthMethod.PHONE} data-testid="phone-content">
          <PhoneInput
            label={t("login.phone")}
            error={!!error}
            onChange={handleChangePhone}
            disabled={isLoading}
            value={phone}
            className={styles.input}
            data-testid="phone-input"
          />
        </Tabs.Content>
      </Tabs>
      <Input
        onChange={handleChangePassword}
        label={t("login.password")}
        value={password}
        type="password"
        className={styles.input}
        placeholder={t("login.enterPassword")}
        disabled={isLoading}
        data-testid="password-input"
      />
      {error && (
        <div className={styles.error} data-testid="error-message">
          {error}
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
