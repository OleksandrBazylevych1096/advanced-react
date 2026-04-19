import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {usePlaceOrder} from "./usePlaceOrder.ts";

const testCtx = vi.hoisted(() => ({
    localizedPathMock: vi.fn((path: string) => path),
    createPaymentSessionMutationMock: vi.fn(),
    defaultShippingAddressQueryMock: vi.fn(),
    checkIsCheckoutReadyMock: vi.fn(),
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

vi.mock("../../../api/checkoutApi/checkoutApi.ts", () => ({
    useCreatePaymentSessionMutation: () => [
        testCtx.createPaymentSessionMutationMock,
        {isLoading: false},
    ],
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetDefaultShippingAddressQuery: (...args: unknown[]) =>
        testCtx.defaultShippingAddressQueryMock(...args),
}));

vi.mock("@/entities/user", () => ({
    selectUserCurrency: (state: StateSchema) => state.user?.currency || "USD",
    selectIsAuthenticated: (state: StateSchema) =>
        Boolean(state.user?.userData && state.user?.accessToken),
}));

vi.mock("../../../lib/validation/checkIsCheckoutReady.ts", () => ({
    checkIsCheckoutReady: (...args: unknown[]) => testCtx.checkIsCheckoutReadyMock(...args),
}));

vi.mock("@/shared/lib/state", () => ({
    useLocalizedRoutePath: () => testCtx.localizedPathMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector({
            user: {currency: "USD", userData: {id: "u1"}, accessToken: "token-1"},
        } as StateSchema),
}));

describe("usePlaceOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.createPaymentSessionMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                sessionId: "session-1",
                stripePaymentIntentId: "pi_1",
                stripeClientSecret: "cs_1",
                checkoutUrl: "https://stripe.test/checkout/session-1",
                status: "pending_payment",
                amount: 18,
                currency: "USD",
                expiresAt: "2026-03-14T10:30:00.000Z",
            }),
        });
        testCtx.defaultShippingAddressQueryMock.mockReturnValue({
            data: {
                id: "addr-1",
                streetAddress: "Main st",
                city: "Boston",
                country: "US",
                numberOfApartment: "1",
                zipCode: "02118",
                isDefault: true,
                latitude: 0,
                longitude: 0,
            },
        });
        testCtx.checkIsCheckoutReadyMock.mockReturnValue(true);
    });

    test("creates payment session with normalized checkout payload", async () => {
        const {result} = renderHook(() =>
            usePlaceOrder({
                summary: undefined,
                deliverySelection: {
                    deliveryDate: "2026-03-14",
                    deliveryTime: "10:00",
                },
                tip: 5,
                couponCode: "SAVE10",
            }),
        );

        await act(async () => {
            await result.current.actions.submitOrder();
        });

        expect(testCtx.createPaymentSessionMutationMock).toHaveBeenCalledTimes(1);
        expect(testCtx.createPaymentSessionMutationMock).toHaveBeenCalledWith(
            expect.objectContaining({
                paymentMethod: "stripe",
                currency: "USD",
                shippingCountry: "US",
                billingCountry: "US",
                tipAmount: 5,
                couponCode: "SAVE10",
            }),
        );
    });

    test("throws when checkout is not ready", async () => {
        testCtx.checkIsCheckoutReadyMock.mockReturnValue(false);

        const {result} = renderHook(() =>
            usePlaceOrder({
                summary: undefined,
                deliverySelection: null,
                tip: 0,
                couponCode: "",
            }),
        );

        await expect(result.current.actions.submitOrder()).rejects.toThrow("Checkout is not ready");
        expect(testCtx.createPaymentSessionMutationMock).not.toHaveBeenCalled();
    });

    test("sets payment error when checkout url is missing", async () => {
        testCtx.createPaymentSessionMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                sessionId: "session-1",
                stripePaymentIntentId: "pi_1",
                stripeClientSecret: "cs_1",
                checkoutUrl: undefined,
                status: "pending_payment",
                amount: 18,
                currency: "USD",
                expiresAt: "2026-03-14T10:30:00.000Z",
            }),
        });

        const {result} = renderHook(() =>
            usePlaceOrder({
                summary: undefined,
                deliverySelection: {
                    deliveryDate: "2026-03-14",
                    deliveryTime: "10:00",
                },
                tip: 5,
                couponCode: "SAVE10",
            }),
        );

        await act(async () => {
            await result.current.actions.proceedToStripeCheckout();
        });

        expect(result.current.data.paymentSessionError).toBe("stripeCheckoutUrlMissing");
    });
});
