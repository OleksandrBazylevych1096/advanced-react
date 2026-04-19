import {
    mockInvalidCouponResponse,
    mockValidCouponResponse,
} from "@/features/apply-coupon/config/test/mockData";

import {mockCart} from "@/entities/cart/config/test/mockData";
import type {Cart, CartTotals} from "@/entities/cart/model/types/CartSchema";

import {DEFAULT_TIP_AMOUNT} from "./constants";
import type {CheckoutOptions} from "./types";

export const resolveCoupon = (
    couponCode?: string | null,
): {
    code: string | null;
    discountAmount: number;
    isValid: boolean;
    message?: string;
} => {
    if (!couponCode) {
        return {
            code: null,
            discountAmount: 0,
            isValid: true,
        };
    }

    if (couponCode === mockValidCouponResponse.code) {
        return {
            code: couponCode,
            discountAmount: mockValidCouponResponse.discountAmount,
            isValid: true,
            message: mockValidCouponResponse.message,
        };
    }

    return {
        code: couponCode,
        discountAmount: 0,
        isValid: false,
        message: mockInvalidCouponResponse.message,
    };
};

export const calculateCartTotals = (
    cartItems: Cart["items"],
    options: Pick<CheckoutOptions, "couponCode" | "tipAmount"> = {},
): CartTotals => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const coupon = resolveCoupon(options.couponCode);
    const tipAmount = options.tipAmount ?? DEFAULT_TIP_AMOUNT;
    const estimatedShipping = cartItems.length > 0 ? mockCart.totals.estimatedShipping : 0;
    const estimatedTax = cartItems.length > 0 ? mockCart.totals.estimatedTax : 0;

    return {
        ...mockCart.totals,
        subtotal,
        totalItems,
        estimatedShipping,
        estimatedTax,
        discountAmount: coupon.discountAmount,
        total: subtotal + estimatedShipping + estimatedTax + tipAmount - coupon.discountAmount,
    };
};
