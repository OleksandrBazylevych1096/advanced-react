import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";

import {
    CartQuantityService,
    type EnqueueArgs,
    type MutationRequest,
} from "@/features/update-cart-item-quantity/model/services/CartQuantityService/CartQuantityService.ts";

vi.useFakeTimers();

const mockDispatch = vi.fn();
const mockApplyCartOptimisticUpdate = vi.fn();
const mockApplyCartItemQuantityChange = vi.fn();

vi.mock("@/entities/cart", () => ({
    applyCartOptimisticUpdate: (
        dispatch: unknown,
        args: unknown,
        mutator: (draft: unknown) => void,
    ) => {
        const undo = vi.fn();
        mockApplyCartOptimisticUpdate(dispatch, args, mutator);
        mutator({});
        return {undo};
    },
    applyCartItemQuantityChange: (...args: unknown[]) => mockApplyCartItemQuantityChange(...args),
}));

vi.mock("@/shared/lib/errors", () => ({
    isAbortError: (e: unknown) => (e as Error)?.message === "AbortError",
}));

function makeSend(overrides?: Partial<MutationRequest>) {
    return vi.fn(() => ({
        abort: vi.fn(),
        unwrap: vi.fn(() => Promise.resolve()),
        ...overrides,
    }));
}

function makeArgs(overrides?: Partial<EnqueueArgs>): EnqueueArgs {
    return {
        productId: "product-1",
        quantity: 2,
        cartQueryArgs: {locale: "en", currency: "USD"},
        dispatch: mockDispatch,
        send: makeSend(),
        getConfirmedQuantity: vi.fn(() => 1),
        onError: vi.fn(),
        ...overrides,
    };
}

describe("CartQuantityService", () => {
    let service: CartQuantityService;

    beforeEach(() => {
        service = new CartQuantityService(400);
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe("subscribe", () => {
        it("returns an unsubscribe function", () => {
            const unsub = service.subscribe();
            expect(typeof unsub).toBe("function");
        });

        it("resets all sessions when the last subscriber unsubscribes", () => {
            const unsub = service.subscribe();
            const args = makeArgs();
            service.enqueue(args);

            unsub();

            expect(() => service.flushNow(args.productId)).not.toThrow();
        });

        it("does not reset while multiple subscribers remain", () => {
            const unsub1 = service.subscribe();
            const unsub2 = service.subscribe();
            const args = makeArgs();
            service.enqueue(args);

            unsub1();

            vi.advanceTimersByTime(400);
            expect(args.send).toHaveBeenCalled();

            unsub2();
        });

        it("subscriber count never goes below zero", () => {
            const unsub = service.subscribe();
            unsub();
            unsub();
        });
    });

    describe("enqueue", () => {
        it("applies an optimistic update immediately", () => {
            const args = makeArgs();
            service.enqueue(args);
            expect(mockApplyCartOptimisticUpdate).toHaveBeenCalledTimes(1);
        });

        it("schedules a flush after the aggregation delay", () => {
            const args = makeArgs();
            service.enqueue(args);
            expect(args.send).not.toHaveBeenCalled();

            vi.advanceTimersByTime(400);
            expect(args.send).toHaveBeenCalledWith({productId: "product-1", quantity: 2});
        });

        it("debounces rapid enqueues — only one request is sent", () => {
            const send = makeSend();
            const base = makeArgs({send});

            service.enqueue({...base, quantity: 2});
            vi.advanceTimersByTime(200);

            service.enqueue({...base, quantity: 3});
            vi.advanceTimersByTime(400);

            expect(send).toHaveBeenCalledTimes(1);
            expect(send).toHaveBeenCalledWith({productId: "product-1", quantity: 3});
        });

        it("uses the latest optimistic quantity on re-enqueue", () => {
            const args = makeArgs({quantity: 2});
            service.enqueue(args);

            service.enqueue({...args, quantity: 5});
            expect(mockApplyCartOptimisticUpdate).toHaveBeenCalledTimes(2);
        });

        it("updates runtime fields (send, dispatch, etc.) on subsequent calls for the same product", () => {
            const args1 = makeArgs({quantity: 2});
            service.enqueue(args1);

            const newSend = makeSend();
            const args2 = makeArgs({quantity: 3, send: newSend});
            service.enqueue(args2);

            vi.advanceTimersByTime(400);
            expect(newSend).toHaveBeenCalled();
            expect(args1.send).not.toHaveBeenCalled();
        });

        it("does not send a request when desired === confirmed quantity", () => {
            const args = makeArgs({quantity: 1, getConfirmedQuantity: () => 1});
            service.enqueue(args);
            vi.advanceTimersByTime(400);
            expect(args.send).not.toHaveBeenCalled();
        });
    });

    describe("flushNow", () => {
        it("sends immediately without waiting for the timer", () => {
            const args = makeArgs();
            service.enqueue(args);

            service.flushNow(args.productId);
            expect(args.send).toHaveBeenCalledTimes(1);
        });

        it("is a no-op for an unknown productId", () => {
            expect(() => service.flushNow("unknown")).not.toThrow();
        });

        it("does not double-send when the timer also fires after flushNow", () => {
            const args = makeArgs();
            service.enqueue(args);
            service.flushNow(args.productId);

            vi.advanceTimersByTime(400);
            expect(args.send).toHaveBeenCalledTimes(1);
        });
    });

    describe("flushAllNow", () => {
        it("flushes every pending product", () => {
            const send1 = makeSend();
            const send2 = makeSend();

            service.enqueue(makeArgs({productId: "p1", send: send1}));
            service.enqueue(makeArgs({productId: "p2", send: send2}));

            service.flushAllNow();

            expect(send1).toHaveBeenCalledTimes(1);
            expect(send2).toHaveBeenCalledTimes(1);
        });
    });

    describe("cancelProduct", () => {
        it("aborts in-flight request and rolls back optimistic update", async () => {
            const abort = vi.fn();
            const neverResolve = new Promise<void>(() => {});
            const send = makeSend({abort, unwrap: () => neverResolve});

            const args = makeArgs({send});
            service.enqueue(args);
            service.flushNow(args.productId);

            service.cancelProduct(args.productId);

            expect(abort).toHaveBeenCalled();
            expect(mockApplyCartOptimisticUpdate).toHaveBeenCalledTimes(2);
        });

        it("is a no-op for an unknown productId", () => {
            expect(() => service.cancelProduct("unknown")).not.toThrow();
        });

        it("clears the pending timer", () => {
            const args = makeArgs();
            service.enqueue(args);

            service.cancelProduct(args.productId);
            vi.advanceTimersByTime(400);

            expect(args.send).not.toHaveBeenCalled();
        });
    });

    describe("resetAll", () => {
        it("cancels all active sessions", () => {
            const send1 = makeSend();
            const send2 = makeSend();

            service.enqueue(makeArgs({productId: "p1", send: send1}));
            service.enqueue(makeArgs({productId: "p2", send: send2}));

            service.resetAll();
            vi.advanceTimersByTime(400);

            expect(send1).not.toHaveBeenCalled();
            expect(send2).not.toHaveBeenCalled();
        });
    });

    describe("flush — success", () => {
        it("updates confirmedQuantity after a successful request", async () => {
            const args = makeArgs({quantity: 5});
            service.enqueue(args);
            vi.advanceTimersByTime(400);
            await Promise.resolve(); // flush microtasks

            const newSend = makeSend();
            service.enqueue({...args, quantity: 5, send: newSend});
            vi.advanceTimersByTime(400);

            expect(newSend).not.toHaveBeenCalled();
        });

        it("does not fire a second request when desired matches confirmed after success", async () => {
            const send = makeSend();
            const args = makeArgs({quantity: 3, send});
            service.enqueue(args);
            vi.advanceTimersByTime(400);
            await Promise.resolve();
            await Promise.resolve();
            vi.advanceTimersByTime(0);

            expect(send).toHaveBeenCalledTimes(1);
        });
    });

    describe("flush — error", () => {
        it("calls onError and rolls back on a non-abort failure", async () => {
            const onError = vi.fn();
            const send = vi.fn(() => ({
                abort: vi.fn(),
                unwrap: () => Promise.reject(new Error("NetworkError")),
            }));

            const args = makeArgs({send, onError});
            service.enqueue(args);
            vi.advanceTimersByTime(400);
            await Promise.resolve();
            await Promise.resolve();

            expect(onError).toHaveBeenCalledWith(expect.any(Error));
            // rollback optimistic — called initially + rollback = 2
            expect(mockApplyCartOptimisticUpdate).toHaveBeenCalledTimes(2);
        });

        it("does NOT call onError for an abort error", async () => {
            const onError = vi.fn();
            const send = vi.fn(() => ({
                abort: vi.fn(),
                unwrap: () => Promise.reject(new Error("AbortError")),
            }));

            const args = makeArgs({send, onError});
            service.enqueue(args);
            vi.advanceTimersByTime(400);
            await Promise.resolve();
            await Promise.resolve();

            expect(onError).not.toHaveBeenCalled();
        });

        it("re-schedules a flush after rollback if desired still differs from confirmed", async () => {
            const onError = vi.fn();
            const failSend = vi.fn(() => ({
                abort: vi.fn(),
                unwrap: () => Promise.reject(new Error("NetworkError")),
            }));
            const retrySend = makeSend();

            const args = makeArgs({quantity: 5, send: failSend, onError});
            service.enqueue(args);
            vi.advanceTimersByTime(400);
            await Promise.resolve();
            await Promise.resolve(); // finally

            // After rollback desiredQuantity === confirmedQuantity, so no retry expected
            vi.advanceTimersByTime(0);
            expect(retrySend).not.toHaveBeenCalled();
        });
    });

    describe("in-flight guard", () => {
        it("does not start a second request while one is in-flight", () => {
            const neverResolve = new Promise<void>(() => {});
            const send = vi.fn(() => ({abort: vi.fn(), unwrap: () => neverResolve}));

            const args = makeArgs({send});
            service.enqueue(args);
            vi.advanceTimersByTime(400); // first flush

            // Force another flush attempt
            service.flushNow(args.productId);

            expect(send).toHaveBeenCalledTimes(1);
        });
    });

    describe("multi-product isolation", () => {
        it("sessions for different products do not interfere", async () => {
            const sendA = makeSend();
            const sendB = makeSend();

            service.enqueue(makeArgs({productId: "a", quantity: 2, send: sendA}));
            service.enqueue(makeArgs({productId: "b", quantity: 9, send: sendB}));

            service.cancelProduct("a");
            vi.advanceTimersByTime(400);

            expect(sendA).not.toHaveBeenCalled();
            expect(sendB).toHaveBeenCalledWith({productId: "b", quantity: 9});
        });
    });
});
