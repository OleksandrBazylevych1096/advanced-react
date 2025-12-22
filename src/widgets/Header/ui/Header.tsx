import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";

import { ManageAddress } from "@/features/manageAddress";

import { logout, selectUserData } from "@/entities/user";

import LogoIcon from "@/shared/assets/icons/Logo.svg?react";
import SearchIcon from "@/shared/assets/icons/Search.svg?react";
import UsersIcon from "@/shared/assets/icons/Users.svg?react";
import { routePaths } from "@/shared/config";
import { cn, useAppDispatch, useAppSelector } from "@/shared/lib";
import { AppIcon, Button, Input } from "@/shared/ui";

import styles from "./Header.module.scss";
import { LanguageSwitcher } from "./LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher/ThemeSwitcher";

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();

  const handleLoginClick = () => {
    navigate(routePaths.login);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (pathname === routePaths.login) return;

  return (
    <header className={styles.header}>
      <div className={cn(styles.section, styles.addressSection)}>
        <LogoIcon className={styles.logo} />
        <ManageAddress />
      </div>

      <div className={styles.section}>
        <Input
          className={styles.search}
          placeholder={t("header.searchBy")}
          Icon={<AppIcon size={18} Icon={SearchIcon} theme="background" />}
          rounded
        />
      </div>
      <div className={styles.section}>
        <Button theme="secondary">
          <span>{t("header.cart")}</span>
        </Button>
        {user?.id ? (
          <Button onClick={handleLogout} theme="outline">
            <AppIcon Icon={UsersIcon} />
            <span>{t("header.logout")}</span>
          </Button>
        ) : (
          <Button onClick={handleLoginClick} theme="outline">
            <AppIcon Icon={UsersIcon} />
            <span>{t("header.login")}</span>
          </Button>
        )}

        <ThemeSwitcher />

        <LanguageSwitcher />
      </div>
    </header>
  );
};
