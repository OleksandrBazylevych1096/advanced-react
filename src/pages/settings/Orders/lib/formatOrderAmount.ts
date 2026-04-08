export const formatOrderAmount = (locale: string, amount: number, currency: string): string => {
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount);
    } catch {
        return amount.toFixed(2);
    }
};
