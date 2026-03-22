import type {Dispatch} from "@reduxjs/toolkit";

import {applyCartItemQuantityChange, applyCartOptimisticUpdate} from "@/entities/cart";

import type {ApiLocaleCurrencyParams} from "@/shared/api";
import {isAbortError} from "@/shared/lib/errors";

import {createCartQuantityEngine} from "../../model/services/cartQuantityEngine/cartQuantityEngine";

const DEFAULT_AGGREGATION_MS = 400;
type Timer = ReturnType<typeof setTimeout>;

export type MutationRequest = {
    abort?: () => void;
    unwrap?: () => Promise<unknown>;
};

type SendUpdateFn = (args: {productId: string; quantity: number}) => MutationRequest;

export type EnqueueArgs = {
    productId: string;
    quantity: number;
    cartQueryArgs: ApiLocaleCurrencyParams;
    dispatch: Dispatch;
    send: SendUpdateFn;
    getConfirmedQuantity: (productId: string) => number;
    onError?: (error: unknown) => void;
};

type ProductRuntimeSession = {
    inFlight: MutationRequest | null;
    timer: Timer | null;
    optimisticUndo: (() => void) | null;
    cartQueryArgs: ApiLocaleCurrencyParams;
    dispatch: Dispatch;
    send: SendUpdateFn;
    onError?: (error: unknown) => void;
};

export interface CartQuantityCoordinator {
    subscribe: () => () => void;
    enqueue: (args: EnqueueArgs) => void;
    flushNow: (productId: string) => void;
    flushAllNow: () => void;
    cancelProduct: (productId: string) => void;
    resetAll: () => void;
}

export const createCartQuantityCoordinator = (
    aggregationMs = DEFAULT_AGGREGATION_MS,
): CartQuantityCoordinator => {
    let subscribers = 0;
    const runtimeSessions = new Map<string, ProductRuntimeSession>();
    const engine = createCartQuantityEngine();

    const clearTimer = (session: ProductRuntimeSession) => {
        if (!session.timer) return;

        clearTimeout(session.timer);
        session.timer = null;
    };

    const applyOptimisticQuantity = (
        productId: string,
        session: ProductRuntimeSession,
        quantity: number,
    ) => {
        session.optimisticUndo?.();
        session.optimisticUndo = null;

        const patch = applyCartOptimisticUpdate(
            session.dispatch,
            session.cartQueryArgs,
            (draft) => {
                applyCartItemQuantityChange(draft, productId, quantity);
            },
        );

        session.optimisticUndo = patch.undo;
    };

    const rollbackToConfirmedQuantity = (productId: string, session: ProductRuntimeSession) => {
        session.optimisticUndo?.();
        session.optimisticUndo = null;

        const rollback = engine.rollbackToConfirmed(productId);
        if (!rollback || !rollback.didChange) return;

        applyCartOptimisticUpdate(session.dispatch, session.cartQueryArgs, (draft) => {
            applyCartItemQuantityChange(draft, productId, rollback.rollbackQuantity);
        });
    };

    const scheduleFlush = (productId: string, delay = aggregationMs) => {
        const session = runtimeSessions.get(productId);
        if (!session) return;

        clearTimer(session);
        session.timer = setTimeout(() => {
            const currentSession = runtimeSessions.get(productId);
            if (!currentSession) return;

            currentSession.timer = null;
            flush(productId);
        }, delay);
    };

    const flush = (productId: string) => {
        const session = runtimeSessions.get(productId);
        if (!session || session.inFlight) return;

        const quantity = engine.startFlush(productId);
        if (quantity === null) return;

        const request = session.send({
            productId,
            quantity,
        });

        session.inFlight = request;

        const requestPromise = request.unwrap ? request.unwrap() : Promise.resolve(undefined);

        void requestPromise
            .then(() => {
                const currentSession = runtimeSessions.get(productId);
                if (!currentSession || currentSession.inFlight !== request) return;

                const success = engine.markSuccess(productId);
                if (success?.hasConverged) {
                    currentSession.optimisticUndo = null;
                }
            })
            .catch((error: unknown) => {
                const currentSession = runtimeSessions.get(productId);
                if (!currentSession || currentSession.inFlight !== request) return;
                if (!isAbortError(error)) {
                    currentSession.onError?.(error);
                }

                rollbackToConfirmedQuantity(productId, currentSession);
            })
            .finally(() => {
                const currentSession = runtimeSessions.get(productId);
                if (!currentSession || currentSession.inFlight !== request) return;

                currentSession.inFlight = null;

                const clearInFlightResult = engine.clearInFlight(productId);
                if (clearInFlightResult?.needsFollowUpFlush) {
                    scheduleFlush(productId, 0);
                }
            });
    };

    const cancelProduct = (productId: string) => {
        const session = runtimeSessions.get(productId);
        if (!session) return;

        clearTimer(session);
        session.inFlight?.abort?.();
        session.inFlight = null;

        rollbackToConfirmedQuantity(productId, session);
        engine.removeSession(productId);
        runtimeSessions.delete(productId);
    };

    const resetAll = () => {
        [...runtimeSessions.keys()].forEach((productId) => {
            cancelProduct(productId);
        });
        engine.reset();
    };

    const subscribe = () => {
        subscribers += 1;

        return () => {
            subscribers = Math.max(0, subscribers - 1);
            if (subscribers === 0) {
                resetAll();
            }
        };
    };

    const enqueue = ({
        productId,
        quantity,
        cartQueryArgs,
        dispatch,
        send,
        getConfirmedQuantity,
        onError,
    }: EnqueueArgs) => {
        const currentSession = runtimeSessions.get(productId);
        if (!currentSession) {
            engine.ensureSession(productId, getConfirmedQuantity(productId), quantity);
            runtimeSessions.set(productId, {
                inFlight: null,
                timer: null,
                optimisticUndo: null,
                cartQueryArgs,
                dispatch,
                send,
                onError,
            });
        } else {
            currentSession.cartQueryArgs = cartQueryArgs;
            currentSession.dispatch = dispatch;
            currentSession.send = send;
            currentSession.onError = onError;
        }

        engine.setDesiredQuantity(productId, quantity);

        const session = runtimeSessions.get(productId);
        if (!session) return;

        applyOptimisticQuantity(productId, session, quantity);
        scheduleFlush(productId);
    };

    const flushNow = (productId: string) => {
        const session = runtimeSessions.get(productId);
        if (!session) return;

        clearTimer(session);
        flush(productId);
    };

    return {
        subscribe,
        enqueue,
        flushNow,
        flushAllNow: () => {
            [...runtimeSessions.keys()].forEach((productId) => {
                flushNow(productId);
            });
        },
        cancelProduct,
        resetAll,
    };
};
