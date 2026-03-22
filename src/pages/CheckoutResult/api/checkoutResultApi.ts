import {baseAPI} from "@/shared/api";

import type {CheckoutSessionDetails} from "../model/types/checkoutResultTypes.ts";

interface ConfirmPaymentFallbackRequest {
    sessionId: string;
}

interface GetCheckoutPaymentSessionRequest {
    sessionId: string;
}

export const checkoutResultApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCheckoutPaymentSession: build.query<
            CheckoutSessionDetails,
            GetCheckoutPaymentSessionRequest
        >({
            query: ({sessionId}) => ({
                url: `/checkout/payment-session/${sessionId}`,
            }),
        }),

        confirmPaymentFallback: build.mutation<void, ConfirmPaymentFallbackRequest>({
            query: ({sessionId}) => ({
                url: `/checkout/${sessionId}/confirm-payment`,
                method: "PATCH",
            }),
        }),
    }),
});

export const {useGetCheckoutPaymentSessionQuery, useConfirmPaymentFallbackMutation} =
    checkoutResultApi;
