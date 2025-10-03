import type { SupportedLngsType } from "./LanguageIconList";

export type CurrencyType = "USD" | "EUR";

type LanguageCurrencyType = Record<SupportedLngsType, CurrencyType>;

export const languageCurrencyList: LanguageCurrencyType = {
  en: "USD",
  de: "EUR",
};
