import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";

import {
    createCartQuantityCoordinator,
    type EnqueueArgs,
    type MutationRequest,
} from "./cartQuantityCoordinator.ts";

const applyCartItemQuantityChangeMock = vi.fn();
const applyCartOptimisticUpdateMock = vi.fn();

vi.mock("@/entities/cart", () => ({
    applyCartItemQuantityChange: (...args: unknown[]) => applyCartItemQuantityChangeMock(...args),
    applyCartOptimisticUpdate: (...args: unknown[]) => applyCartOptimisticUpdateMock(...args),
}));

const flushMicrotasks = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

describe("cartQuantityCoordinator", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const enqueue = (
        coordinator: ReturnType<typeof createCartQuantityCoordinator>,
        args: Omit<EnqueueArgs, "getConfirmedQuantity"> & {
            getConfirmedQuantity?: (productId: string) => number;
        },
    ) => {
        coordinator.enqueue({
            ...args,
            getConfirmedQuantity: args.getConfirmedQuantity ?? (() => 0),
        });
    };

    test("aggregates rapid updates into one request and applies optimistic patches immediately", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const dispatch = vi.fn();
        const getConfirmedQuantity = vi.fn(() => 0);
        const send = vi.fn(
            (): MutationRequest => ({
                unwrap: () => Promise.resolve(undefined),
            }),
        );

        applyCartOptimisticUpdateMock.mockImplementation(
            (_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            },
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 1,
            dispatch,
            send,
            getConfirmedQuantity,
        });
        enqueue(coordinator, {
            productId: "p1",
            quantity: 2,
            dispatch,
            send,
            getConfirmedQuantity,
        });
        enqueue(coordinator, {
            productId: "p1",
            quantity: 3,
            dispatch,
            send,
            getConfirmedQuantity,
        });

        expect(applyCartOptimisticUpdateMock).toHaveBeenCalledTimes(3);
        expect(send).not.toHaveBeenCalled();

        vi.advanceTimersByTime(400);
        await flushMicrotasks();
        vi.advanceTimersByTime(0);
        await flushMicrotasks();

        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenCalledWith({
            productId: "p1",
            quantity: 3,
        });
        expect(getConfirmedQuantity).toHaveBeenCalledTimes(1);
    });

    test("rolls back to confirmed quantity and shows toast on request error", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const dispatch = vi.fn();
        const onError = vi.fn();
        const undoOrder: number[] = [];
        const getConfirmedQuantity = vi.fn(() => 5);
        let undoIndex = 0;

        applyCartOptimisticUpdateMock.mockImplementation(
            (_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                undoIndex += 1;
                const currentUndoIndex = undoIndex;
                return {undo: () => undoOrder.push(currentUndoIndex)};
            },
        );

        const send = vi.fn(
            (): MutationRequest => ({
                unwrap: () => Promise.reject(new Error("boom")),
            }),
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 6,
            dispatch,
            send,
            getConfirmedQuantity,
            onError,
        });
        enqueue(coordinator, {
            productId: "p1",
            quantity: 8,
            dispatch,
            send,
            getConfirmedQuantity,
            onError,
        });

        vi.advanceTimersByTime(400);
        await flushMicrotasks();

        expect(undoOrder).toEqual([1, 2]);
        expect(applyCartItemQuantityChangeMock.mock.calls.map((call) => call[2])).toEqual([
            6, 8, 5,
        ]);
        expect(onError).toHaveBeenCalledTimes(1);
    });

    test("cancelProduct aborts request, rolls back to confirmed state, and avoids onError on abort", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const dispatch = vi.fn();
        const onError = vi.fn();
        const abort = vi.fn();
        const getConfirmedQuantity = vi.fn(() => 2);

        const abortError = new Error("aborted");
        abortError.name = "AbortError";

        let rejectRequest: ((error: unknown) => void) | undefined;
        const unwrap = vi.fn(
            () =>
                new Promise<unknown>((_, reject) => {
                    rejectRequest = reject;
                }),
        );

        applyCartOptimisticUpdateMock
            .mockImplementationOnce((_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            })
            .mockImplementationOnce((_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            });

        const send = vi.fn(
            (): MutationRequest => ({
                unwrap,
                abort,
            }),
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 4,
            dispatch,
            send,
            getConfirmedQuantity,
            onError,
        });

        vi.advanceTimersByTime(400);
        await flushMicrotasks();

        coordinator.cancelProduct("p1");
        rejectRequest?.(abortError);
        await flushMicrotasks();

        expect(abort).toHaveBeenCalledTimes(1);
        expect(applyCartItemQuantityChangeMock.mock.calls.map((call) => call[2])).toEqual([4, 2]);
        expect(onError).not.toHaveBeenCalled();
    });

    test("queues a follow-up flush when desired quantity changes during in-flight request", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const dispatch = vi.fn();
        const onError = vi.fn();
        const getConfirmedQuantity = vi.fn(() => 0);

        let resolveFirstRequest: (() => void) | undefined;
        const send = vi
            .fn()
            .mockImplementationOnce(() => ({
                unwrap: () =>
                    new Promise<void>((resolve) => {
                        resolveFirstRequest = resolve;
                    }),
            }))
            .mockImplementationOnce(() => ({
                unwrap: () => Promise.resolve(undefined),
            }));

        applyCartOptimisticUpdateMock.mockImplementation(
            (_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            },
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 1,
            dispatch,
            send,
            getConfirmedQuantity,
            onError,
        });

        vi.advanceTimersByTime(400);
        await flushMicrotasks();
        expect(send).toHaveBeenCalledTimes(1);
        expect(send).toHaveBeenNthCalledWith(1, {productId: "p1", quantity: 1});

        enqueue(coordinator, {
            productId: "p1",
            quantity: 3,
            dispatch,
            send,
            getConfirmedQuantity,
        });

        vi.advanceTimersByTime(400);
        await flushMicrotasks();
        expect(send).toHaveBeenCalledTimes(1);

        resolveFirstRequest?.();
        await flushMicrotasks();
        vi.advanceTimersByTime(0);
        await flushMicrotasks();

        expect(send).toHaveBeenCalledTimes(2);
        expect(send).toHaveBeenNthCalledWith(2, {productId: "p1", quantity: 3});
    });

    test("does not resend after successful confirmation when quantity is unchanged", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const dispatch = vi.fn();
        const getConfirmedQuantity = vi.fn(() => 0);
        const send = vi.fn(
            (): MutationRequest => ({
                unwrap: () => Promise.resolve(undefined),
            }),
        );

        applyCartOptimisticUpdateMock.mockImplementation(
            (_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            },
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 2,
            dispatch,
            send,
            getConfirmedQuantity,
        });

        vi.advanceTimersByTime(400);
        await flushMicrotasks();
        coordinator.flushNow("p1");
        await flushMicrotasks();

        expect(send).toHaveBeenCalledTimes(1);
    });

    test("flushAllNow flushes all pending product updates immediately", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const dispatch = vi.fn();
        const getConfirmedQuantity = vi.fn(() => 0);
        const send = vi.fn(
            (): MutationRequest => ({
                unwrap: () => Promise.resolve(undefined),
            }),
        );

        applyCartOptimisticUpdateMock.mockImplementation(
            (_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            },
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 2,
            dispatch,
            send,
            getConfirmedQuantity,
        });
        enqueue(coordinator, {
            productId: "p2",
            quantity: 5,
            dispatch,
            send,
            getConfirmedQuantity,
        });

        coordinator.flushAllNow();
        await flushMicrotasks();

        expect(send).toHaveBeenCalledTimes(2);
        expect(send).toHaveBeenCalledWith({productId: "p1", quantity: 2});
        expect(send).toHaveBeenCalledWith({productId: "p2", quantity: 5});
    });

    test("resetAll triggered by last unsubscribe aborts in-flight requests", async () => {
        const coordinator = createCartQuantityCoordinator(400);
        const unsubscribe = coordinator.subscribe();
        const dispatch = vi.fn();
        const onError = vi.fn();
        const getConfirmedQuantity = vi.fn(() => 0);
        const abort = vi.fn();

        const abortError = new Error("aborted");
        abortError.name = "AbortError";

        let rejectRequest: ((error: unknown) => void) | undefined;
        const send = vi.fn(
            (): MutationRequest => ({
                abort,
                unwrap: () =>
                    new Promise<unknown>((_, reject) => {
                        rejectRequest = reject;
                    }),
            }),
        );

        applyCartOptimisticUpdateMock.mockImplementation(
            (_dispatch: unknown, updater: (draft: unknown) => void) => {
                updater({} as never);
                return {undo: vi.fn()};
            },
        );

        enqueue(coordinator, {
            productId: "p1",
            quantity: 1,
            dispatch,
            send,
            getConfirmedQuantity,
            onError,
        });

        vi.advanceTimersByTime(400);
        await flushMicrotasks();
        unsubscribe();

        rejectRequest?.(abortError);
        await flushMicrotasks();

        expect(abort).toHaveBeenCalledTimes(1);
        expect(onError).not.toHaveBeenCalled();
    });
});
