import { API_URL } from "./api/api";
import {
  AuthProviders,
  AuthMethod,
  LOCAL_STORAGE_USER_KEY,
  type AuthMethodType,
  type AuthProvidersType,
} from "./auth/auth";
import {
  languageIconList,
  type SupportedLngsType,
} from "./i18n/LanguageIconList";
import { routePaths, AppRoutes } from "./router/routePaths";
import {
  Theme,
  ThemeContext,
  LOCAL_STORAGE_THEME_KEY,
  type ThemeType,
} from "./theme/ThemeContext";
import { useTheme } from "./theme/useTheme";

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
  type AuthProvidersType,
  type AuthMethodType,
  type ThemeType,
  type SupportedLngsType,
};
