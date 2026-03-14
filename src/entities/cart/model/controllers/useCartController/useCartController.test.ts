import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCartController} from "./useCartController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    getCartQueryMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {
            language: "en",
        },
    }),
}));

vi.mock("../../../api/cartApi", () => ({
    useGetCartQuery: (...args: unknown[]) => testCtx.getCartQueryMock(...args),
}));

describe("useCartController", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.state = {
            user: {currency: "USD"},
            cart: {
                guestItems: [
                    {
                        productId: "p1",
                        quantity: 2,
                        addedAt: 1,
                        product: {
                            id: "p1",
                            name: "Product 1",
                            price: 100,
                            stock: 10,
                            images: [],
                        },
                    },
                ],
                isInitialized: true,
            },
        } as StateSchema;

        testCtx.refetchMock = vi.fn();
        testCtx.getCartQueryMock.mockReturnValue({
            data: undefined,
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: testCtx.refetchMock,
        });
    });

    test("builds guest cart data from local state and disables server statuses", () => {
        const {result} = renderHook(() => useCartController({isAuthenticated: false}));

        expect(testCtx.getCartQueryMock).toHaveBeenCalledWith(
            {locale: "en", currency: "USD"},
            {skip: true},
        );
        expect(result.current.derived.itemCount).toBe(2);
        expect(result.current.data.cart).toMatchObject({
            items: [
                {
                    id: "guest-p1",
                    productId: "p1",
                    quantity: 2,
                },
            ],
            totals: {
                subtotal: 200,
                totalItems: 2,
                total: 200,
            },
        });
        expect(result.current.status).toEqual({
            isLoading: false,
            isFetching: false,
            isError: false,
        });
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);
    });

    test("uses server cart data and status flags for authenticated users", () => {
        const serverCart = {
            items: [],
            totals: {
                subtotal: 500,
                totalItems: 4,
                estimatedShipping: 20,
                estimatedTax: 30,
                total: 550,
            },
        };

        testCtx.getCartQueryMock.mockReturnValue({
            data: serverCart,
            isLoading: true,
            isFetching: true,
            isError: true,
            refetch: testCtx.refetchMock,
        });

        const {result} = renderHook(() => useCartController({isAuthenticated: true}));

        expect(testCtx.getCartQueryMock).toHaveBeenCalledWith(
            {locale: "en", currency: "USD"},
            {skip: false},
        );
        expect(result.current.data.cart).toBe(serverCart);
        expect(result.current.derived.itemCount).toBe(4);
        expect(result.current.status).toEqual({
            isLoading: true,
            isFetching: true,
            isError: true,
        });
    });
});
