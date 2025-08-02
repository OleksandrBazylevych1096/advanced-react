import { useTranslation } from "react-i18next";

import { languageIconList, type SupportedLngsType } from "@/shared/config";
import { AppIcon, Button } from "@/shared/ui";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as SupportedLngsType;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "de" : "en");
  };
  return (
    <Button onClick={toggleLanguage} theme="ghost">
      <AppIcon Icon={languageIconList[currentLanguage]} />
    </Button>
  );
};
