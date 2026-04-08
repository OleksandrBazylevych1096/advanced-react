import type {Dispatch} from "@reduxjs/toolkit";

import {applyCartItemQuantityChange, applyCartOptimisticUpdate} from "@/entities/cart";

import type {ApiLocaleCurrencyParams} from "@/shared/api";
import {isAbortError} from "@/shared/lib/errors";

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

type SessionState = {
    confirmedQuantity: number;
    desiredQuantity: number;
    inFlightQuantity: number | null;
    inFlight: MutationRequest | null;
    timer: Timer | null;
    optimisticUndo: (() => void) | null;
    cartQueryArgs: ApiLocaleCurrencyParams;
    dispatch: Dispatch;
    send: SendUpdateFn;
    onError?: (error: unknown) => void;
};

export class CartQuantityService {
    private subscribers = 0;
    private readonly sessions = new Map<string, SessionState>();
    private readonly aggregationMs: number;

    constructor(aggregationMs = DEFAULT_AGGREGATION_MS) {
        this.aggregationMs = aggregationMs;
    }

    subscribe(): () => void {
        this.subscribers += 1;

        return () => {
            this.subscribers = Math.max(0, this.subscribers - 1);
            if (this.subscribers === 0) {
                this.resetAll();
            }
        };
    }

    enqueue({
        productId,
        quantity,
        cartQueryArgs,
        dispatch,
        send,
        getConfirmedQuantity,
        onError,
    }: EnqueueArgs): void {
        const current = this.getSession(productId);

        if (!current) {
            this.ensureSession(productId, getConfirmedQuantity(productId), quantity, {
                cartQueryArgs,
                dispatch,
                send,
                onError,
            });
        } else {
            current.cartQueryArgs = cartQueryArgs;
            current.dispatch = dispatch;
            current.send = send;
            current.onError = onError;
        }

        const session = this.getSession(productId);
        if (!session) return;

        session.desiredQuantity = quantity;
        this.applyOptimisticQuantity(productId, session, quantity);
        this.scheduleFlush(productId);
    }

    flushNow(productId: string): void {
        const session = this.getSession(productId);
        if (!session) return;
        this.clearTimer(session);
        this.flush(productId);
    }

    flushAllNow(): void {
        [...this.sessions.keys()].forEach((productId) => this.flushNow(productId));
    }

    cancelProduct(productId: string): void {
        const session = this.getSession(productId);
        if (!session) return;

        this.clearTimer(session);
        session.inFlight?.abort?.();
        session.inFlight = null;

        this.rollbackToConfirmed(productId, session);
        this.sessions.delete(productId);
    }

    resetAll(): void {
        [...this.sessions.keys()].forEach((productId) => this.cancelProduct(productId));
    }

    private getSession(productId: string) {
        return this.sessions.get(productId);
    }

    private ensureSession(
        productId: string,
        confirmedQuantity: number,
        desiredQuantity: number,
        runtimeFields: Pick<SessionState, "cartQueryArgs" | "dispatch" | "send" | "onError">,
    ): void {
        if (this.sessions.has(productId)) return;

        this.sessions.set(productId, {
            confirmedQuantity,
            desiredQuantity,
            inFlightQuantity: null,
            inFlight: null,
            timer: null,
            optimisticUndo: null,
            ...runtimeFields,
        });
    }

    private clearTimer(session: SessionState): void {
        if (!session.timer) return;
        clearTimeout(session.timer);
        session.timer = null;
    }

    private scheduleFlush(productId: string, delay = this.aggregationMs): void {
        const session = this.getSession(productId);
        if (!session) return;

        this.clearTimer(session);
        session.timer = setTimeout(() => {
            const current = this.getSession(productId);
            if (!current) return;
            current.timer = null;
            this.flush(productId);
        }, delay);
    }

    private applyOptimisticQuantity(
        productId: string,
        session: SessionState,
        quantity: number,
    ): void {
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
    }

    private rollbackToConfirmed(productId: string, session: SessionState): void {
        session.optimisticUndo?.();
        session.optimisticUndo = null;

        const didChange = session.desiredQuantity !== session.confirmedQuantity;
        const rollbackQuantity = session.confirmedQuantity;
        session.desiredQuantity = session.confirmedQuantity;

        if (!didChange) return;

        applyCartOptimisticUpdate(session.dispatch, session.cartQueryArgs, (draft) => {
            applyCartItemQuantityChange(draft, productId, rollbackQuantity);
        });
    }

    private flush(productId: string): void {
        const session = this.getSession(productId);
        if (!session || session.inFlight) return;
        if (session.desiredQuantity === session.confirmedQuantity) return;

        const quantity = session.desiredQuantity;
        session.inFlightQuantity = quantity;

        const request = session.send({productId, quantity});
        session.inFlight = request;

        const requestPromise = request.unwrap ? request.unwrap() : Promise.resolve(undefined);

        void requestPromise
            .then(() => {
                const current = this.getSession(productId);
                if (!current || current.inFlight !== request) return;

                current.confirmedQuantity = quantity;

                if (current.desiredQuantity === current.confirmedQuantity) {
                    current.optimisticUndo = null;
                }
            })
            .catch((error: unknown) => {
                const current = this.getSession(productId);
                if (!current || current.inFlight !== request) return;

                if (!isAbortError(error)) {
                    current.onError?.(error);
                }

                this.rollbackToConfirmed(productId, current);
            })
            .finally(() => {
                const current = this.getSession(productId);
                if (!current || current.inFlight !== request) return;

                current.inFlight = null;
                current.inFlightQuantity = null;

                if (current.desiredQuantity !== current.confirmedQuantity) {
                    this.scheduleFlush(productId, 0);
                }
            });
    }
}
