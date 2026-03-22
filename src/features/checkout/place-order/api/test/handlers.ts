import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {
    mockCheckoutSummary,
    mockCheckoutSummaryWithCoupon,
    mockPlaceOrderResponse,
} from "./mockData";

const checkoutSummaryBase = createHandlers({
    endpoint: `${API_URL}/checkout/summary`,
    method: "get",
    defaultData: mockCheckoutSummary,
    errorData: {error: "Failed to load checkout summary"},
    errorStatus: 500,
});

const createPaymentSessionBase = createHandlers({
    endpoint: `${API_URL}/checkout/payment-session`,
    method: "post",
    defaultData: mockPlaceOrderResponse,
    errorData: {error: "Failed to create payment session"},
    errorStatus: 500,
});

export const placeOrderHandlers = {
    checkoutSummary: extendHandlers(checkoutSummaryBase, {
        withCoupon: http.get(`${API_URL}/checkout/summary`, () =>
            HttpResponse.json(mockCheckoutSummaryWithCoupon),
        ),
        empty: http.get(`${API_URL}/checkout/summary`, () =>
            HttpResponse.json({...mockCheckoutSummary, items: []}),
        ),
    }),
    createPaymentSession: createPaymentSessionBase,
};
