import { useTranslation } from "react-i18next";

import { userActions } from "@/entities/user";

import {
  languageCurrencyList,
  languageIconList,
  type SupportedLngsType,
} from "@/shared/config";
import { useAppDispatch } from "@/shared/lib";
import { AppIcon, Button } from "@/shared/ui";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = i18n.language as SupportedLngsType;

  const toggleLanguage = () => {
    const newLng = i18n.language === "en" ? "de" : "en";
    i18n.changeLanguage(newLng);
    dispatch(userActions.setCurrency(languageCurrencyList[newLng]));
  };
  return (
    <Button onClick={toggleLanguage} theme="ghost">
      <AppIcon Icon={languageIconList[currentLanguage]} />
    </Button>
  );
};
