import {useMemo} from "react";
import {useTranslation} from "react-i18next";

import {selectUserCurrency} from "@/entities/user/@x/cart";

import {createControllerResult, useAppSelector} from "@/shared/lib/state";

import {useValidateCartQuery} from "../../../api/cartApi";
import type {CartItem} from "../../types/CartSchema";

export interface CartItemValidation {
    productId: string;
    issues: string[];
    isValid: boolean;
}

interface UseCartValidationOptions {
    isAuthenticated: boolean;
}

export const useCartValidationController = (
    items: CartItem[],
    options: UseCartValidationOptions,
) => {
    const {isAuthenticated} = options;
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);

    const {data: serverValidation, isLoading: isValidating} = useValidateCartQuery(
        {locale: i18n.language, currency},
        {
            skip: !isAuthenticated || items.length === 0,
            pollingInterval: 60_000,
        },
    );

    const clientValidation = useMemo((): CartItemValidation[] => {
        return items.map((item) => {
            const issues: string[] = [];

            if (item.product.stock <= 0) {
                issues.push("This product is out of stock");
            } else if (item.quantity > item.product.stock) {
                issues.push(`Only ${item.product.stock} available (you have ${item.quantity})`);
            }

            return {
                productId: item.product.id,
                issues,
                isValid: issues.length === 0,
            };
        });
    }, [items]);

    const validation =
        isAuthenticated && serverValidation
            ? serverValidation.map((sv) => ({
                  productId: sv.productId,
                  issues: sv.issues,
                  isValid: sv.isValid,
              }))
            : clientValidation;

    const hasIssues = validation.some((v) => !v.isValid);

    const getItemValidation = (productId: string): CartItemValidation | undefined =>
        validation.find((v) => v.productId === productId);

    return createControllerResult({
        data: {
            validation,
        },
        derived: {
            hasIssues,
        },
        status: {
            isValidating,
        },
        actions: {
            getItemValidation,
        },
    });
};
