import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCheckoutPageController} from "./useCheckoutPageController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    summaryQueryMock: vi.fn(),
    defaultAddressQueryMock: vi.fn(),
    deliverySelectionQueryMock: vi.fn(),
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    localizedPathMock: vi.fn((path: string) => path.replace(":lng", "en")),
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

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/features/checkout/apply-coupon", () => ({
    selectApplyCouponCode: (state: StateSchema) => state.applyCoupon?.code ?? "",
}));

vi.mock("@/features/checkout/choose-delivery-date", () => ({
    useGetDeliverySelectionQuery: (...args: unknown[]) =>
        testCtx.deliverySelectionQueryMock(...args),
}));

vi.mock("@/features/checkout/choose-delivery-tip", () => ({
    selectChooseDeliveryTipAmount: (state: StateSchema) => state.chooseDeliveryTip?.amount ?? 0,
}));

vi.mock("@/features/checkout/place-order", () => ({
    useGetCheckoutSummaryQuery: (...args: unknown[]) => testCtx.summaryQueryMock(...args),
}));

vi.mock("@/features/shipping-address/save", () => ({
    saveShippingAddressActions: {
        openManageShippingAddressModal: () => ({
            type: "shipping/openManageShippingAddressModal",
        }),
    },
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetDefaultShippingAddressQuery: (...args: unknown[]) =>
        testCtx.defaultAddressQueryMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
    selectUserCurrency: (state: StateSchema) => state.user?.currency ?? "USD",
}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => testCtx.localizedPathMock,
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useCheckoutPageController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: {id: "u-1"}, currency: "EUR"},
            chooseDeliveryTip: {amount: 7},
            applyCoupon: {code: "SAVE10"},
        } as StateSchema;

        testCtx.summaryQueryMock.mockReturnValue({
            data: {items: [], totals: {total: 117}},
            isLoading: false,
            isError: false,
        });
        testCtx.defaultAddressQueryMock.mockReturnValue({
            data: {streetAddress: "Main st"},
            isLoading: false,
        });
        testCtx.deliverySelectionQueryMock.mockReturnValue({
            data: {deliveryDate: "2026-03-20", deliveryTime: "18:00"},
            isLoading: false,
        });
    });

    test("passes locale, currency, tip and coupon to summary query", () => {
        renderHook(() => useCheckoutPageController());

        expect(testCtx.summaryQueryMock).toHaveBeenCalledWith(
            {
                locale: "en",
                currency: "EUR",
                tipAmount: 7,
                couponCode: "SAVE10",
            },
            {
                skip: false,
            },
        );
        expect(testCtx.defaultAddressQueryMock).toHaveBeenCalledWith(undefined, {
            skip: false,
        });
        expect(testCtx.deliverySelectionQueryMock).toHaveBeenCalledWith(
            {locale: "en"},
            {skip: false},
        );
    });

    test("skips queries for guest user", () => {
        testCtx.state = {
            user: {userData: null, currency: "USD"},
            chooseDeliveryTip: {amount: 0},
            applyCoupon: {code: ""},
        } as unknown as StateSchema;

        renderHook(() => useCheckoutPageController());

        expect(testCtx.summaryQueryMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({skip: true}),
        );
        expect(testCtx.defaultAddressQueryMock).toHaveBeenCalledWith(
            undefined,
            expect.objectContaining({skip: true}),
        );
        expect(testCtx.deliverySelectionQueryMock).toHaveBeenCalledWith(
            {locale: "en"},
            expect.objectContaining({skip: true}),
        );
    });

    test("aggregates loading state from all queries", () => {
        testCtx.summaryQueryMock.mockReturnValueOnce({
            data: undefined,
            isLoading: false,
            isError: false,
        });
        testCtx.defaultAddressQueryMock.mockReturnValueOnce({
            data: undefined,
            isLoading: true,
        });
        testCtx.deliverySelectionQueryMock.mockReturnValueOnce({
            data: undefined,
            isLoading: false,
        });

        const {result} = renderHook(() => useCheckoutPageController());

        expect(result.current.status.isLoading).toBe(true);
        expect(result.current.status.isError).toBe(false);
    });

    test("returns summary error state", () => {
        testCtx.summaryQueryMock.mockReturnValueOnce({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        const {result} = renderHook(() => useCheckoutPageController());

        expect(result.current.status.isError).toBe(true);
    });

    test("opens shipping address modal and navigates to cart page", () => {
        const {result} = renderHook(() => useCheckoutPageController());

        result.current.actions.openManageShippingAddressModal();
        result.current.actions.goToCartPage();

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/openManageShippingAddressModal",
        });
        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/cart");
    });
});
