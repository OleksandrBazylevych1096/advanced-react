import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCancelOrder} from "./useCancelOrder.ts";

const testCtx = vi.hoisted(() => ({
    successMock: vi.fn(),
    errorMock: vi.fn(),
    cancelOrderMutationMock: vi.fn(),
    isCancellingOrder: false,
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock("@/shared/lib/state", () => ({}));

vi.mock("@/shared/lib/notifications", () => ({
    useToast: () => ({
        success: testCtx.successMock,
        error: testCtx.errorMock,
    }),
}));

vi.mock("../../../api/cancelOrderApi.ts", () => ({
    useCancelOrderMutation: () => [
        testCtx.cancelOrderMutationMock,
        {isLoading: testCtx.isCancellingOrder},
    ],
}));

describe("useCancelOrder", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.isCancellingOrder = false;
        testCtx.cancelOrderMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("opens modal and cancels order with success toast", async () => {
        const {result} = renderHook(() => useCancelOrder({orderId: "order-1"}));

        expect(result.current.data.isCancelOrderModalOpen).toBe(false);

        act(() => {
            result.current.actions.openCancelOrderModal();
        });

        expect(result.current.data.isCancelOrderModalOpen).toBe(true);

        await act(async () => {
            await result.current.actions.confirmOrderCancellation();
        });

        expect(testCtx.cancelOrderMutationMock).toHaveBeenCalledWith({id: "order-1"});
        expect(testCtx.successMock).toHaveBeenCalledWith("order.cancelOrder.success");
        expect(result.current.data.isCancelOrderModalOpen).toBe(false);
    });

    test("shows error toast when cancel request fails", async () => {
        testCtx.cancelOrderMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("request failed")),
        });

        const {result} = renderHook(() => useCancelOrder({orderId: "order-2"}));

        act(() => {
            result.current.actions.openCancelOrderModal();
        });

        await act(async () => {
            await result.current.actions.confirmOrderCancellation();
        });

        expect(testCtx.errorMock).toHaveBeenCalledWith("order.cancelOrder.error");
        expect(result.current.data.isCancelOrderModalOpen).toBe(true);
    });
});
