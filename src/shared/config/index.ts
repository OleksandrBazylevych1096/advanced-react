import {
    AuthMethod,
    type AuthMethodType,
    AuthProviders,
    type AuthProvidersType,
    LOCAL_STORAGE_USER_KEY,
} from "./auth/auth";
import {API_URL, PROJECT_ENV, STRIPE_PUBLISHABLE_KEY} from "./env/consts";
import {i18n, supportedLngs} from "./i18n";
import {type CurrencyType, languageCurrencyList} from "./i18n/LanguageCurrencyList";
import {languageIconList, type SupportedLngsType} from "./i18n/LanguageIconList";
import {AppRoutes, routePaths} from "./router/routePaths";
import {THEME_DECORATOR_CONTAINER_ID} from "./storybook/decorators/ThemeDecorator";
import {stripePromise} from "./stripe/stripe";
import {LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext, type ThemeType} from "./theme/ThemeContext";
import {useTheme} from "./theme/useTheme";

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
    i18n,
    languageCurrencyList,
    supportedLngs,
    stripePromise,
    THEME_DECORATOR_CONTAINER_ID,
    type CurrencyType,
    type AuthProvidersType,
    type AuthMethodType,
    type ThemeType,
    type SupportedLngsType,
};
