import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing/msw/createHandlers";

import {
    mockCheckoutSessionFailed,
    mockCheckoutSessionPaid,
    mockCheckoutSessionPending,
} from "./mockData";

const checkoutSessionBase = createHandlers({
    endpoint: `${API_URL}/checkout/payment-session/:sessionId`,
    method: "get",
    defaultData: mockCheckoutSessionPaid,
    errorData: {error: "Failed to load checkout session"},
    errorStatus: 500,
});

const fallbackConfirmBase = createHandlers({
    endpoint: `${API_URL}/checkout/:sessionId/confirm-payment`,
    method: "patch",
    defaultData: {},
    errorData: {error: "Failed to confirm payment"},
    errorStatus: 500,
});

export const checkoutResultHandlers = {
    checkoutSession: extendHandlers(checkoutSessionBase, {
        pending: http.get(`${API_URL}/checkout/payment-session/:sessionId`, () =>
            HttpResponse.json(mockCheckoutSessionPending),
        ),
        failed: http.get(`${API_URL}/checkout/payment-session/:sessionId`, () =>
            HttpResponse.json(mockCheckoutSessionFailed),
        ),
        paid: http.get(`${API_URL}/checkout/payment-session/:sessionId`, () =>
            HttpResponse.json(mockCheckoutSessionPaid),
        ),
    }),
    confirmFallback: fallbackConfirmBase,
};
