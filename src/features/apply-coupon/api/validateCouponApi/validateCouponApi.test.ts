import {configureStore} from "@reduxjs/toolkit";
import {describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {parseRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {validateCouponApi} from "./validateCouponApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("validateCouponApi", () => {
    test("validateCoupon requests endpoint with locale, currency and couponCode params", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const url = parseRequestUrl(input);

            expect(url.pathname).toContain("/checkout/validate-coupon");
            expect(url.searchParams.get("locale")).toBe("en");
            expect(url.searchParams.get("currency")).toBe("USD");
            expect(url.searchParams.get("couponCode")).toBe("SAVE10");

            return new Response(
                JSON.stringify({
                    code: "SAVE10",
                    isValid: true,
                    discountAmount: 10,
                    promotionCodeId: "promo-1",
                }),
                {status: 200, headers: {"Content-Type": "application/json"}},
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            validateCouponApi.endpoints.validateCoupon.initiate({
                locale: "en",
                currency: "USD",
                couponCode: "SAVE10",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toMatchObject({
            code: "SAVE10",
            isValid: true,
            discountAmount: 10,
            promotionCodeId: "promo-1",
        });
    });
});
