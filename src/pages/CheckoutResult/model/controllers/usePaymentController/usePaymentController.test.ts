import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {usePaymentController} from "./usePaymentController.ts";

const testCtx = vi.hoisted(() => ({
    getCheckoutPaymentSessionQueryMock: vi.fn(),
    confirmPaymentFallbackMutationMock: vi.fn(),
    dispatchMock: vi.fn(),
    clearCartStateMock: vi.fn(),
}));

vi.mock("@/entities/cart", () => ({
    clearCartState: testCtx.clearCartStateMock,
}));

vi.mock("@/pages/CheckoutResult/api/checkoutResultApi.ts", () => ({
    useGetCheckoutPaymentSessionQuery: testCtx.getCheckoutPaymentSessionQueryMock,
    useConfirmPaymentFallbackMutation: () => [
        testCtx.confirmPaymentFallbackMutationMock,
        {isLoading: false},
    ],
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
}));

describe("usePaymentController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.confirmPaymentFallbackMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("marks session as resolved on paid status", () => {
        testCtx.getCheckoutPaymentSessionQueryMock.mockReturnValue({
            data: {
                sessionId: "session-1",
                stripePaymentIntentId: "pi_1",
                stripeClientSecret: "cs_1",
                status: "paid",
                currency: "usd",
                amount: 120,
                expiresAt: "2026-03-14T10:30:00.000Z",
                order: {
                    id: "order-1",
                    orderNumber: "#1",
                    status: "CONFIRMED",
                    paymentStatus: "PAID",
                },
            },
            isError: false,
            isFetching: false,
            isLoading: false,
            fulfilledTimeStamp: 1,
            refetch: vi.fn(),
        });

        const {result} = renderHook(() => usePaymentController({sessionId: "session-1"}));

        expect(result.current.data.paymentStatus).toBe("PAID");
        expect(result.current.status.isPolling).toBe(false);
        expect(result.current.status.isResolved).toBe(true);
        expect(result.current.status.isFailed).toBe(false);
        expect(testCtx.clearCartStateMock).toHaveBeenCalledWith(testCtx.dispatchMock, {
            invalidateCartTags: true,
        });
    });

    test("marks as failed when session status is payment_failed", () => {
        testCtx.getCheckoutPaymentSessionQueryMock.mockReturnValue({
            data: {
                sessionId: "session-1",
                stripePaymentIntentId: "pi_1",
                stripeClientSecret: "cs_1",
                status: "payment_failed",
                currency: "usd",
                amount: 120,
                expiresAt: "2026-03-14T10:30:00.000Z",
                order: null,
            },
            isError: false,
            isFetching: false,
            isLoading: false,
            fulfilledTimeStamp: 2,
            refetch: vi.fn(),
        });

        const {result} = renderHook(() => usePaymentController({sessionId: "session-1"}));

        expect(result.current.data.paymentStatus).toBe("FAILED");
        expect(result.current.status.isFailed).toBe(true);
        expect(result.current.status.isResolved).toBe(false);
    });

    test("keeps polling when payment is pending", () => {
        testCtx.getCheckoutPaymentSessionQueryMock.mockReturnValue({
            data: {
                sessionId: "session-1",
                stripePaymentIntentId: "pi_1",
                stripeClientSecret: "cs_1",
                status: "pending_payment",
                currency: "usd",
                amount: 120,
                expiresAt: "2026-03-14T10:30:00.000Z",
                order: null,
            },
            isError: false,
            isFetching: true,
            isLoading: false,
            fulfilledTimeStamp: 3,
            refetch: vi.fn(),
        });

        const {result} = renderHook(() => usePaymentController({sessionId: "session-1"}));

        expect(result.current.data.paymentStatus).toBe("PENDING");
        expect(result.current.status.isPolling).toBe(true);
        expect(result.current.status.isResolved).toBe(false);
        expect(result.current.status.isFailed).toBe(false);
        expect(result.current.status.isSystemError).toBe(false);
        expect(result.current.status.isPaymentDeclined).toBe(false);
    });

    test("marks system error when session polling request fails", () => {
        testCtx.getCheckoutPaymentSessionQueryMock.mockReturnValue({
            data: null,
            isError: true,
            isFetching: false,
            isLoading: false,
            fulfilledTimeStamp: 4,
            refetch: vi.fn(),
        });

        const {result} = renderHook(() => usePaymentController({sessionId: "session-1"}));

        expect(result.current.status.isPolling).toBe(false);
        expect(result.current.status.isResolved).toBe(false);
        expect(result.current.status.isSystemError).toBe(true);
        expect(result.current.status.isPaymentDeclined).toBe(false);
        expect(result.current.status.isFailed).toBe(false);
    });
});
