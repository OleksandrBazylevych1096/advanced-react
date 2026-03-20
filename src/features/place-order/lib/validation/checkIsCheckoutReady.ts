import type {CheckoutSummary} from "@/features/place-order";

export const checkIsCheckoutReady = (
    summary: CheckoutSummary | undefined,
    hasAddress: boolean,
): boolean => {
    if (!summary) return false;
    if (!hasAddress) return false;
    if (!summary.items.length) return false;

    return summary.validation.every((validationItem) => validationItem.isValid);
};
