import {baseAPI, type ApiLocaleCurrencyParams} from "@/shared/api";

interface ValidateCouponRequest extends ApiLocaleCurrencyParams {
    couponCode: string;
}

interface ValidateCouponResponse {
    code: string;
    isValid: boolean;
    discountAmount: number;
    promotionCodeId?: string;
    message?: string;
}

export const validateCouponApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        validateCoupon: build.query<ValidateCouponResponse, ValidateCouponRequest>({
            query: ({locale, currency, couponCode}) => ({
                url: "/checkout/validate-coupon",
                params: {
                    locale,
                    currency,
                    couponCode,
                },
            }),
        }),
    }),
});

export const {useLazyValidateCouponQuery} = validateCouponApi;
