import type {SupportedLngsType} from "@/shared/config";
import {supportedLngs} from "@/shared/config/i18n/i18n";

export const isSupportedLanguage = (
    language: string | undefined,
): language is SupportedLngsType => {
    if (!language) {
        return false;
    }

    return supportedLngs.some((lng) => lng === language);
};
