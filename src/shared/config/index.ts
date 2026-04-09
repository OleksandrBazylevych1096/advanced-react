import {
    AuthMethod,
    type AuthMethodType,
    AuthProviders,
    type AuthProvidersType,
    LOCAL_STORAGE_USER_KEY
} from "@/shared/config/auth/auth.ts";
import {API_URL, PROJECT_ENV, STRIPE_PUBLISHABLE_KEY} from "@/shared/config/env/consts.ts";
import type {CurrencyType} from "@/shared/config/i18n/LanguageCurrencyList.ts";
import {languageCurrencyList} from "@/shared/config/i18n/LanguageCurrencyList.ts";
import {languageIconList, type SupportedLngsType} from "@/shared/config/i18n/LanguageIconList.ts";
import {AppRoutes, routePaths} from "@/shared/config/router/routePaths.ts";
import {THEME_DECORATOR_CONTAINER_ID} from "@/shared/config/storybook/decorators/ThemeDecorator.tsx";
import {LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext, type ThemeType} from "@/shared/config/theme/ThemeContext.ts";
import {useTheme} from "@/shared/config/theme/useTheme.ts";

export {default, default as i18n, supportedLngs} from "./i18n/i18n";
export {
    routePaths,
    AppRoutes,
    Theme,
    ThemeContext,
    LOCAL_STORAGE_THEME_KEY,
    LOCAL_STORAGE_USER_KEY,
    languageIconList,
    useTheme,
    AuthProviders,
    AuthMethod,
    API_URL,
    PROJECT_ENV,
    STRIPE_PUBLISHABLE_KEY,
    languageCurrencyList,
    THEME_DECORATOR_CONTAINER_ID,
    type CurrencyType,
    type AuthProvidersType,
    type AuthMethodType,
    type ThemeType,
    type SupportedLngsType,
};

