import {type ApiLocaleCurrencyParams, baseAPI} from "@/shared/api";

import type {CheckoutSummary, PlaceOrderRequest, PlaceOrderResponse,} from "../../model/types/checkoutTypes.ts";

interface GetCheckoutSummaryRequest extends ApiLocaleCurrencyParams {
    couponCode?: string;
    tipAmount?: number;
}

export const checkoutApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCheckoutSummary: build.query<CheckoutSummary, GetCheckoutSummaryRequest>({
            query: ({locale, currency, couponCode, tipAmount}) => ({
                url: "/checkout/summary",
                params: {
                    locale,
                    currency,
                    ...(couponCode ? {couponCode} : {}),
                    ...(typeof tipAmount === "number" ? {tipAmount} : {}),
                },
            }),
            providesTags: ["CartValidation"],
        }),

        createPaymentSession: build.mutation<PlaceOrderResponse, PlaceOrderRequest>({
            query: (body) => ({
                url: "/checkout/payment-session",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart", "CartValidation"],
        }),
    }),
});

export const {useGetCheckoutSummaryQuery, useCreatePaymentSessionMutation} = checkoutApi;
