import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useRemoveFromCartController} from "./useRemoveFromCartController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
    storeGetStateMock: vi.fn(),
    removeItemMutationMock: vi.fn(),
    toastErrorMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
}));

vi.mock("@/entities/cart", () => ({
    cartActions: {
        removeItem: (productId: string) => ({
            type: "cart/removeItem",
            payload: productId,
        }),
    },
    setGuestCart: vi.fn(),
    broadcastCartUpdate: vi.fn(),
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
    isAbortError: (error: unknown) => error instanceof Error && error.name === "AbortError",
}));

vi.mock("../../api/removeFromCartApi", () => ({
    useRemoveFromCartMutation: () => [testCtx.removeItemMutationMock],
}));

describe("useRemoveFromCartController", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.state = {
            user: {userData: undefined},
        } as StateSchema;

        testCtx.storeGetStateMock.mockReturnValue({
            cart: {
                guestItems: [{productId: "p1", quantity: 1}],
            },
        });

        testCtx.removeItemMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("removes guest item and syncs guest storage without API call", async () => {
        const cartModule = await import("@/entities/cart");
        const {result} = renderHook(() => useRemoveFromCartController());

        await act(async () => {
            await result.current.actions.removeItem("p1");
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "cart/removeItem",
            payload: "p1",
        });
        expect(testCtx.removeItemMutationMock).not.toHaveBeenCalled();
        expect(cartModule.setGuestCart).toHaveBeenCalledWith([{productId: "p1", quantity: 1}]);
        expect(cartModule.broadcastCartUpdate).toHaveBeenCalledWith([
            {productId: "p1", quantity: 1},
        ]);
    });

    test("shows toast for authenticated remove failure", async () => {
        testCtx.state = {
            user: {userData: {id: "u1"}},
        } as StateSchema;
        testCtx.removeItemMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("boom")),
        });

        const {result} = renderHook(() => useRemoveFromCartController());

        await act(async () => {
            await result.current.actions.removeItem("p1");
        });

        expect(testCtx.removeItemMutationMock).toHaveBeenCalledWith("p1");
        expect(testCtx.toastErrorMock).toHaveBeenCalledWith("Failed to remove item");
    });

    test("ignores AbortError without toast", async () => {
        testCtx.state = {
            user: {userData: {id: "u1"}},
        } as StateSchema;
        const abortError = new Error("aborted");
        abortError.name = "AbortError";

        testCtx.removeItemMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(abortError),
        });

        const {result} = renderHook(() => useRemoveFromCartController());

        await act(async () => {
            await result.current.actions.removeItem("p1");
        });

        expect(testCtx.toastErrorMock).not.toHaveBeenCalled();
    });
});
