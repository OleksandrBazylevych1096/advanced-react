import type {i18n} from "i18next";

export const getFallbackLanguage = (instance: i18n): string => {
    const fallback = instance.options.fallbackLng;

    if (typeof fallback === "string") {
        return fallback;
    }

    if (Array.isArray(fallback) && fallback.length > 0) {
        return fallback[0];
    }

    return instance.language;
};
