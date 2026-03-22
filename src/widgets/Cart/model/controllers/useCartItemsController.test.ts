import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCartItemsController} from "./useCartItemsController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    toastErrorMock: vi.fn(),
    refetchMock: vi.fn(),
    removeItemMock: vi.fn(),
    updateQuantityMock: vi.fn(),
    getItemValidationMock: vi.fn(),
    useUpdateQuantityControllerMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
    selectUserCurrency: (state: StateSchema) => state.user?.currency,
}));

vi.mock("@/entities/cart", () => ({
    useCartController: () => ({
        data: {
            cart: {
                items: [
                    {
                        id: "c1",
                        productId: "p1",
                        quantity: 2,
                        product: {
                            id: "p1",
                            name: "Phone",
                            description: "Smartphone",
                            price: 100,
                            stock: 10,
                            images: [],
                        },
                    },
                ],
            },
        },
        status: {
            isLoading: false,
            isError: false,
        },
        actions: {
            refetch: testCtx.refetchMock,
        },
    }),
    useCartValidationController: () => ({
        actions: {
            getItemValidation: testCtx.getItemValidationMock,
        },
    }),
}));

vi.mock("@/features/cart/remove", () => ({
    useRemoveFromCartController: () => ({
        actions: {
            removeItem: testCtx.removeItemMock,
        },
    }),
}));

vi.mock("@/features/cart/update-item-quantity", () => ({
    useUpdateCartItemQuantityController: (args?: unknown) =>
        testCtx.useUpdateQuantityControllerMock(args),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
    useToast: () => ({
        error: testCtx.toastErrorMock,
    }),
}));

describe("useCartItemsController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {
                userData: {id: "u1"},
                currency: "USD",
            },
        } as StateSchema;
        testCtx.useUpdateQuantityControllerMock.mockReturnValue({
            actions: {
                updateQuantity: testCtx.updateQuantityMock,
            },
        });
    });

    test("returns mapped cart items, currency, statuses and actions", () => {
        const {result} = renderHook(() => useCartItemsController());

        expect(result.current.data.items).toHaveLength(1);
        expect(result.current.data.currency).toBe("USD");
        expect(result.current.status).toEqual({
            isLoading: false,
            isError: false,
        });
        expect(result.current.derived.itemsCount).toBe(1);
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);
        expect(result.current.actions.removeItem).toBe(testCtx.removeItemMock);
        expect(result.current.actions.updateQuantity).toBe(testCtx.updateQuantityMock);
        expect(result.current.actions.getItemValidation).toBe(testCtx.getItemValidationMock);
    });

    test("passes onError callback to quantity controller and shows toast on failure", () => {
        renderHook(() => useCartItemsController());

        const callArgs = testCtx.useUpdateQuantityControllerMock.mock.calls[0]?.[0] as
            | {onError?: () => void}
            | undefined;

        expect(callArgs?.onError).toBeTypeOf("function");

        act(() => {
            callArgs?.onError?.();
        });

        expect(testCtx.toastErrorMock).toHaveBeenCalledWith("Failed to update cart");
    });
});
