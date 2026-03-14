import type {CurrencyType, SupportedLngsType} from "@/shared/config";

export interface ApiLocaleParams {
    locale: SupportedLngsType;
}

export interface ApiLocaleCurrencyParams extends ApiLocaleParams {
    currency: CurrencyType;
}
