import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCheckoutSidebarController} from "./useCheckoutSidebarController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    deliverySelectionQueryMock: vi.fn(),
    checkoutSummaryQueryMock: vi.fn(),
    calculateTotalsMock: vi.fn(),
    buildRowsMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {language: "en"},
        t: (key: string) => key,
    }),
}));

vi.mock("@/features/checkout/choose-delivery-date", () => ({
    useGetDeliverySelectionQuery: (...args: unknown[]) =>
        testCtx.deliverySelectionQueryMock(...args),
}));

vi.mock("@/features/checkout/place-order", () => ({
    useGetCheckoutSummaryQuery: (...args: unknown[]) => testCtx.checkoutSummaryQueryMock(...args),
    calculateCheckoutTotals: (...args: unknown[]) => testCtx.calculateTotalsMock(...args),
    buildCheckoutSummaryRows: (...args: unknown[]) => testCtx.buildRowsMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: (state: StateSchema) => state.user?.currency || "USD",
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useCheckoutSidebarController", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.state = {
            user: {userData: {id: "u-1"}, currency: "USD"},
            chooseDeliveryTip: {amount: 5},
            applyCoupon: {
                code: "SAVE10",
                draftCode: "SAVE10",
                message: null,
                isModalOpen: false,
                isApplying: false,
            },
        } as StateSchema;

        testCtx.deliverySelectionQueryMock.mockReturnValue({
            data: {
                deliveryDate: "2026-03-14",
                deliveryTime: "10:00",
            },
        });

        testCtx.checkoutSummaryQueryMock.mockReturnValue({
            data: {
                coupon: null,
                totals: {},
            },
            isLoading: false,
        });

        testCtx.calculateTotalsMock.mockReturnValue({
            couponDiscount: 0,
            totalAmount: 10,
        });
        testCtx.buildRowsMock.mockReturnValue([{label: "Items total", amount: 10}]);
    });

    test("returns summary data and place-order props", () => {
        const {result} = renderHook(() => useCheckoutSidebarController());

        expect(result.current.data.orderSummaryRows).toEqual([{label: "Items total", amount: 10}]);
        expect(result.current.data.totalAmount).toBe(10);
        expect(result.current.status.isSummaryLoading).toBe(false);

        expect(result.current.data.placeOrder.tip).toBe(5);
        expect(result.current.data.placeOrder.couponCode).toBe("SAVE10");
        expect(result.current.data.placeOrder.summary).toEqual({
            coupon: null,
            totals: {},
        });
    });
});
