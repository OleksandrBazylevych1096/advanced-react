import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCoupon} from "./useCoupon.ts";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
    triggerMock: vi.fn(),
    useLazyValidateCouponQueryMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {language: "en"},
    }),
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: () => true,
    selectUserCurrency: () => "USD",
}));

vi.mock("../../../api/validateCouponApi/validateCouponApi", () => ({
    useLazyValidateCouponQuery: () => testCtx.useLazyValidateCouponQueryMock(),
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useCoupon", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: {id: "u-1"}},
            applyCoupon: {
                code: "",
                draftCode: "SAVE10",
                message: null,
                isModalOpen: true,
                isApplying: false,
            },
        } as StateSchema;

        testCtx.triggerMock = vi.fn().mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                code: "SAVE10",
                isValid: true,
                discountAmount: 5,
                promotionCodeId: "promo_1",
            }),
        });
        testCtx.useLazyValidateCouponQueryMock.mockReturnValue([
            testCtx.triggerMock,
            {isFetching: false},
        ]);
    });

    test("applies coupon and stores normalized code", async () => {
        const {result} = renderHook(() => useCoupon());

        await act(async () => {
            await result.current.actions.applyCoupon();
        });

        expect(testCtx.triggerMock).toHaveBeenCalledWith({
            locale: "en",
            currency: "USD",
            couponCode: "SAVE10",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            payload: "SAVE10",
            type: "applyCoupon/setCode",
        });
    });
});
