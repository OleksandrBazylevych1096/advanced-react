import type {CurrencyType, SupportedLngsType} from "@/shared/config";

export const formatCurrency = (currency: CurrencyType, locale: SupportedLngsType, number: number) => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(number)
}