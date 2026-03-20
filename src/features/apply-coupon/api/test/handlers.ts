import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing/msw/createHandlers";

import {mockInvalidCouponResponse, mockValidCouponResponse} from "./mockData";

const validateCouponBase = createHandlers({
    endpoint: `${API_URL}/checkout/validate-coupon`,
    method: "get",
    defaultData: mockValidCouponResponse,
    errorData: {error: "Failed to validate coupon."},
    errorStatus: 500,
});

export const applyCouponHandlers = {
    validateCoupon: extendHandlers(validateCouponBase, {
        invalid: http.get(`${API_URL}/checkout/validate-coupon`, () =>
            HttpResponse.json(mockInvalidCouponResponse),
        ),
    }),
};
