import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import type {Product} from "@/entities/product";

import {useAddToCartController} from "./useAddToCartController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
    storeGetStateMock: vi.fn(),
    toastErrorMock: vi.fn(),
    addToCartMutationMock: vi.fn(),
    serverCartData: undefined as
        | {items: Array<{productId: string; product: {id: string}; quantity: number}>}
        | undefined,
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
}));

vi.mock("@/entities/cart", () => ({
    cartActions: {
        addItem: (payload: unknown) => ({
            type: "cart/addItem",
            payload,
        }),
    },
    setGuestCart: vi.fn(),
    broadcastCartUpdate: vi.fn(),
    selectGuestCartItemByProductId: (state: StateSchema, productId: string) =>
        state.cart?.guestItems?.find((item: {productId: string}) => item.productId === productId),
    useGetCartQuery: () => ({
        data: testCtx.serverCartData,
    }),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppStore: () => ({
        getState: testCtx.storeGetStateMock,
    }),
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
    useToast: () => ({
        error: testCtx.toastErrorMock,
    }),
}));

vi.mock("@/shared/lib/async/debounce/debounceCallback", () => ({
    debounceCallback: () => ({
        run: (fn: () => void) => fn(),
        cancel: vi.fn(),
    }),
}));

vi.mock("../../api/addToCartApi", () => ({
    useAddToCartMutation: () => [testCtx.addToCartMutationMock],
}));

describe("useAddToCartController", () => {
    const product = {
        id: "p1",
        name: "Product 1",
        price: 100,
        stock: 5,
        images: [],
    } as Product;

    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.state = {
            user: {userData: undefined},
            cart: {guestItems: []},
        } as StateSchema;
        testCtx.serverCartData = undefined;
        testCtx.storeGetStateMock.mockReturnValue({
            cart: {
                guestItems: [
                    {
                        productId: "p1",
                        quantity: 1,
                        product,
                        addedAt: 123,
                    },
                ],
            },
        });
        testCtx.addToCartMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("adds item for guest and syncs guest storage", async () => {
        const cartModule = await import("@/entities/cart");
        const {result} = renderHook(() => useAddToCartController(product));

        await act(async () => {
            result.current.actions.addToCart();
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledTimes(1);
        expect(testCtx.dispatchMock.mock.calls[0][0]).toMatchObject({
            type: "cart/addItem",
            payload: {
                productId: "p1",
                quantity: 1,
                product,
            },
        });
        expect(testCtx.addToCartMutationMock).not.toHaveBeenCalled();
        expect(cartModule.setGuestCart).toHaveBeenCalledWith([
            expect.objectContaining({productId: "p1", quantity: 1}),
        ]);
        expect(cartModule.broadcastCartUpdate).toHaveBeenCalledWith([
            expect.objectContaining({productId: "p1", quantity: 1}),
        ]);
    });

    test("clamps guest quantity by remaining stock", async () => {
        testCtx.state = {
            user: {userData: undefined},
            cart: {
                guestItems: [
                    {
                        productId: "p1",
                        quantity: 4,
                        product,
                        addedAt: 1,
                    },
                ],
            },
        } as StateSchema;

        const {result} = renderHook(() => useAddToCartController(product));

        await act(async () => {
            result.current.actions.addToCart(3);
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledTimes(1);
        expect(testCtx.dispatchMock.mock.calls[0][0]).toMatchObject({
            type: "cart/addItem",
            payload: {
                productId: "p1",
                quantity: 1,
            },
        });
    });

    test("sends authenticated add-to-cart mutation instead of guest dispatch", async () => {
        testCtx.state = {
            user: {userData: {id: "u1"}},
            cart: {guestItems: []},
        } as StateSchema;
        testCtx.serverCartData = {
            items: [],
        };

        const {result} = renderHook(() => useAddToCartController(product));

        await act(async () => {
            result.current.actions.addToCart(2);
            await Promise.resolve();
        });

        expect(testCtx.addToCartMutationMock).toHaveBeenCalledWith({
            productId: "p1",
            quantity: 2,
        });
        expect(testCtx.dispatchMock).not.toHaveBeenCalledWith(
            expect.objectContaining({type: "cart/addItem"}),
        );
    });
});
