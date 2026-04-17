import {useTranslation} from "react-i18next";

import {languageIconList} from "@/shared/config";
import type {SupportedLngsType} from "@/shared/config";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

export const LanguageSwitcher = () => {
    const {i18n} = useTranslation();
    const currentLanguage = i18n.language as SupportedLngsType;

    const toggleLanguage = async () => {
        const newLng = i18n.language === "en" ? "de" : "en";
        await i18n.changeLanguage(newLng);
    };

    return (
        <Button
            onClick={toggleLanguage}
            theme="ghost"
            data-testid="language-switcher"
            data-current-language={currentLanguage}
        >
            <AppIcon Icon={languageIconList[currentLanguage]} />
        </Button>
    );
};
