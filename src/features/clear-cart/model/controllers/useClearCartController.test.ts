import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useClearCartController} from "./useClearCartController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    dispatchMock: vi.fn(),
    toastErrorMock: vi.fn(),
    clearCartMutationMock: vi.fn(),
    clearCartMutationState: {isLoading: false},
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
}));

vi.mock("@/entities/cart", () => ({
    clearCartState: vi.fn(),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
    useToast: () => ({
        error: testCtx.toastErrorMock,
    }),
}));

vi.mock("../../api/clearCartApi", () => ({
    useClearCartMutation: () => [testCtx.clearCartMutationMock, testCtx.clearCartMutationState],
}));

describe("useClearCartController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: undefined},
        } as StateSchema;
        testCtx.clearCartMutationState.isLoading = false;
        testCtx.clearCartMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("returns isClearing status from mutation state", () => {
        testCtx.clearCartMutationState.isLoading = true;

        const {result} = renderHook(() => useClearCartController());

        expect(result.current.status.isClearing).toBe(true);
    });

    test("clears guest cart locally without API call", async () => {
        const cartModule = await import("@/entities/cart");
        const {result} = renderHook(() => useClearCartController());

        await act(async () => {
            await result.current.actions.clearCart();
        });

        expect(cartModule.clearCartState).toHaveBeenCalledWith(testCtx.dispatchMock);
        expect(testCtx.clearCartMutationMock).not.toHaveBeenCalled();
    });

    test("calls API for authenticated user", async () => {
        const cartModule = await import("@/entities/cart");
        testCtx.state = {
            user: {userData: {id: "u1"}},
        } as StateSchema;

        const {result} = renderHook(() => useClearCartController());

        await act(async () => {
            await result.current.actions.clearCart();
        });

        expect(testCtx.clearCartMutationMock).toHaveBeenCalledTimes(1);
        expect(cartModule.clearCartState).not.toHaveBeenCalled();
    });

    test("shows toast on authenticated API failure", async () => {
        testCtx.state = {
            user: {userData: {id: "u1"}},
        } as StateSchema;
        testCtx.clearCartMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("boom")),
        });

        const {result} = renderHook(() => useClearCartController());

        await act(async () => {
            await result.current.actions.clearCart();
        });

        expect(testCtx.toastErrorMock).toHaveBeenCalledWith("Failed to clear cart");
    });
});
