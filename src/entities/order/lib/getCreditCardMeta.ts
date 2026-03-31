import {creditCardMap, fallbackCreditCard} from "@/entities/order/config/creditCardMap.tsx";
import type {CreditCardBrandType} from "@/entities/order/model/types/order.ts";

export const getCreditCardMeta = (brand: string | null | undefined) => {
    return creditCardMap[brand as CreditCardBrandType] || fallbackCreditCard;
};
