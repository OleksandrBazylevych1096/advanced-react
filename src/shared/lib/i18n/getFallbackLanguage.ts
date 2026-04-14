import type {i18n} from "i18next";

export const getFallbackLanguage = (instance: i18n): string => {
    const fallback = instance.options.lng;

    if (typeof fallback === "string") {
        return fallback;
    }

    return instance.language;
};
