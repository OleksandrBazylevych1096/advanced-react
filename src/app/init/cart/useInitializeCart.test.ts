import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useInitializeCart} from "./useInitializeCart";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    onCartSyncMock: vi.fn(),
    getGuestCartMock: vi.fn(),
    onCartSyncCallback: undefined as ((items: unknown[]) => void) | undefined,
    unsubscribeMock: vi.fn(),
}));

vi.mock("@/entities/cart", () => ({
    cartActions: {
        setGuestItems: (items: unknown[]) => ({type: "cart/setGuestItems", payload: items}),
        initGuestCart: (items: unknown[]) => ({type: "cart/initGuestCart", payload: items}),
    },
    getGuestCart: () => testCtx.getGuestCartMock(),
    onCartSync: (callback: (items: unknown[]) => void) => {
        testCtx.onCartSyncCallback = callback;
        return testCtx.onCartSyncMock(callback);
    },
}));

vi.mock("@/shared/lib", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
}));

describe("useInitializeCart", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.onCartSyncCallback = undefined;
        testCtx.unsubscribeMock = vi.fn();
        testCtx.onCartSyncMock.mockReturnValue(testCtx.unsubscribeMock);
        testCtx.getGuestCartMock.mockReturnValue([{productId: "p1", quantity: 2}]);
    });

    test("initializes guest cart from storage on mount", () => {
        renderHook(() => useInitializeCart());

        expect(testCtx.getGuestCartMock).toHaveBeenCalledTimes(1);
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "cart/initGuestCart",
            payload: [{productId: "p1", quantity: 2}],
        });
    });

    test("subscribes to cart sync and dispatches incoming items", () => {
        renderHook(() => useInitializeCart());

        expect(testCtx.onCartSyncMock).toHaveBeenCalledTimes(1);
        expect(testCtx.onCartSyncCallback).toBeTypeOf("function");

        act(() => {
            testCtx.onCartSyncCallback?.([{productId: "p2", quantity: 1}]);
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "cart/setGuestItems",
            payload: [{productId: "p2", quantity: 1}],
        });
    });

    test("unsubscribes from cart sync on unmount", () => {
        const {unmount} = renderHook(() => useInitializeCart());

        unmount();

        expect(testCtx.unsubscribeMock).toHaveBeenCalledTimes(1);
    });
});
