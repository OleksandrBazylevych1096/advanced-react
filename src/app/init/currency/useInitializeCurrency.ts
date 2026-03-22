import {useEffect} from "react";

import {userActions} from "@/entities/user";

import type {SupportedLngsType} from "@/shared/config";
import i18n, {languageCurrencyList} from "@/shared/config";
import {getFallbackLanguage, isSupportedLanguage} from "@/shared/lib/i18n";
import {useAppDispatch} from "@/shared/lib/state";

const resolveSupportedLanguage = (language: string): SupportedLngsType => {
    const normalizedLanguage = language.split("-")[0];
    if (isSupportedLanguage(normalizedLanguage)) {
        return normalizedLanguage;
    }

    const fallbackLanguage = getFallbackLanguage(i18n);
    if (isSupportedLanguage(fallbackLanguage)) {
        return fallbackLanguage;
    }

    return "en";
};

export const useInitializeCurrency = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handler = (lng: string) => {
            const supportedLanguage = resolveSupportedLanguage(lng);
            dispatch(userActions.setCurrency(languageCurrencyList[supportedLanguage]));
        };

        i18n.on("languageChanged", handler);

        handler(i18n.language);

        return () => {
            i18n.off("languageChanged", handler);
        };
    }, [dispatch]);
};

