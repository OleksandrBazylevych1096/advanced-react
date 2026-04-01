import type {FunctionComponent, SVGProps} from "react";

import {CreditCardBrand, type CreditCardBrandType} from "@/entities/order/model/types/order.ts";

import AmexCreditCardIcon from "@/shared/assets/icons/AmexCreditCard.svg?react";
import CreditCardIcon from "@/shared/assets/icons/CreditCard.svg?react";
import DiscoverCreditCardIcon from "@/shared/assets/icons/DiscoverCreditCard.svg?react";
import MasterCardCreditCardIcon from "@/shared/assets/icons/MasterCardCreditCard.svg?react";
import VisaCreditCardIcon from "@/shared/assets/icons/VisaCreditCard.svg?react";

interface CreditCardMeta {
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    name: string;
}

export const fallbackCreditCard: CreditCardMeta = {
    icon: CreditCardIcon,
    name: "Credit Card",
};

export const creditCardMap: Record<CreditCardBrandType, CreditCardMeta> = {
    [CreditCardBrand.VISA]: {
        icon: VisaCreditCardIcon,
        name: "Visa",
    },
    [CreditCardBrand.MASTERCARD]: {
        icon: MasterCardCreditCardIcon,
        name: "Mastercard",
    },
    [CreditCardBrand.AMEX]: {
        icon: AmexCreditCardIcon,
        name: "Amex",
    },
    [CreditCardBrand.DISCOVER]: {
        icon: DiscoverCreditCardIcon,
        name: "Discover",
    },
};
