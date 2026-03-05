import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";

import {runOptimisticTxn, type UndoablePatch} from "./runOptimisticTxn";

describe("runOptimisticTxn", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("returns ok result on success", async () => {
        const result = await runOptimisticTxn({apply: () => undefined}, async () => "done");

        expect(result).toEqual({ok: true, data: "done"});
    });

    test("rolls back patches in reverse order", async () => {
        const calls: string[] = [];
        const patchA: UndoablePatch = {undo: () => calls.push("A")};
        const patchB: UndoablePatch = {undo: () => calls.push("B")};

        const result = await runOptimisticTxn(
            {apply: () => [patchA, patchB], minVisibleMsBeforeRollback: 0},
            async () => Promise.reject(new Error("boom")),
        );

        expect(calls).toEqual(["B", "A"]);
        expect(result.ok).toBe(false);
    });

    test("does not rollback when rollbackOnError is false", async () => {
        const undo = vi.fn();

        const result = await runOptimisticTxn(
            {apply: () => ({undo}), rollbackOnError: false},
            async () => Promise.reject(new Error("boom")),
        );

        expect(undo).not.toHaveBeenCalled();
        expect(result.ok).toBe(false);
    });

    test("calls onError on request failure", async () => {
        const onError = vi.fn();

        const result = await runOptimisticTxn(
            {apply: () => undefined, onError, minVisibleMsBeforeRollback: 0},
            async () => Promise.reject(new Error("boom")),
        );

        expect(onError).toHaveBeenCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    test("supports conditional rollback based on error", async () => {
        const undo = vi.fn();
        const abortError = new Error("aborted");
        abortError.name = "AbortError";

        const result = await runOptimisticTxn(
            {
                apply: () => ({undo}),
                rollbackOnError: (error) =>
                    !(error instanceof Error && error.name === "AbortError"),
            },
            async () => Promise.reject(abortError),
        );

        expect(undo).not.toHaveBeenCalled();
        expect(result.ok).toBe(false);
    });

    test("delays rollback until minimum visible time elapses", async () => {
        const undo = vi.fn();

        const resultPromise = runOptimisticTxn({apply: () => ({undo})}, async () =>
            Promise.reject(new Error("boom")),
        );

        await Promise.resolve();
        expect(undo).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(499);
        expect(undo).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1);
        const result = await resultPromise;

        expect(undo).toHaveBeenCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    test("does not delay when elapsed time already exceeds minimum", async () => {
        const undo = vi.fn();

        const resultPromise = runOptimisticTxn(
            {apply: () => ({undo}), minVisibleMsBeforeRollback: 300},
            async () =>
                new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error("boom")), 350);
                }),
        );

        await vi.advanceTimersByTimeAsync(350);

        expect(undo).toHaveBeenCalledTimes(1);
        const result = await resultPromise;
        expect(result.ok).toBe(false);
    });

    test("does not delay when rollback is disabled by policy", async () => {
        const undo = vi.fn();

        const result = await runOptimisticTxn(
            {
                apply: () => ({undo}),
                rollbackOnError: false,
            },
            async () => Promise.reject(new Error("boom")),
        );

        expect(undo).not.toHaveBeenCalled();
        expect(result.ok).toBe(false);
    });

    test("supports explicit opt-out with 0ms", async () => {
        const undo = vi.fn();

        const resultPromise = runOptimisticTxn(
            {
                apply: () => ({undo}),
                minVisibleMsBeforeRollback: 0,
            },
            async () => Promise.reject(new Error("boom")),
        );

        await Promise.resolve();
        const result = await resultPromise;

        expect(undo).toHaveBeenCalledTimes(1);
        expect(result.ok).toBe(false);
    });

    test("still rolls back patches in reverse order after delay", async () => {
        const calls: string[] = [];
        const patchA: UndoablePatch = {undo: () => calls.push("A")};
        const patchB: UndoablePatch = {undo: () => calls.push("B")};

        const resultPromise = runOptimisticTxn(
            {
                apply: () => [patchA, patchB],
                minVisibleMsBeforeRollback: 100,
            },
            async () => Promise.reject(new Error("boom")),
        );

        vi.advanceTimersByTime(99);
        await Promise.resolve();
        expect(calls).toEqual([]);

        vi.advanceTimersByTime(1);
        const result = await resultPromise;

        expect(calls).toEqual(["B", "A"]);
        expect(result.ok).toBe(false);
    });
});
