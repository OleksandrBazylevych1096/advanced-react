import {beforeEach, describe, expect, test, vi} from "vitest";

import {createStore} from "@/app/store";

import {removeFromCartApi} from "./removeFromCartApi";

const mocks = vi.hoisted(() => {
    const capturedTxns: Array<{
        rollbackOnError?: (error: unknown) => boolean;
        onError?: (error: unknown) => void;
    }> = [];
    const pendingResolves: Array<() => void> = [];
    const versions: Record<string, number | undefined> = {};

    const mockGuard = {
        next: vi.fn((key: string) => {
            const nextVersion = (versions[key] ?? 0) + 1;
            versions[key] = nextVersion;
            return nextVersion;
        }),
        isCurrent: vi.fn((key: string, version: number) => versions[key] === version),
        clear: vi.fn((key: string) => {
            delete versions[key];
        }),
    };

    const runOptimisticTxnMock = vi.fn(
        async (txn: {
            rollbackOnError?: (error: unknown) => boolean;
            onError?: (error: unknown) => void;
        }) => {
            capturedTxns.push(txn);
            await new Promise<void>((resolve) => {
                pendingResolves.push(resolve);
            });
            return {ok: true as const, data: undefined};
        },
    );

    return {
        capturedTxns,
        pendingResolves,
        versions,
        mockGuard,
        runOptimisticTxnMock,
    };
});

vi.mock("@/shared/lib", async () => {
    const actual = await vi.importActual<typeof import("@/shared/lib")>("@/shared/lib");

    return {
        ...actual,
        createVersionGuard: () => mocks.mockGuard,
        runOptimisticTxn: mocks.runOptimisticTxnMock,
    };
});

describe("removeFromCartApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.capturedTxns.length = 0;
        mocks.pendingResolves.length = 0;
        Object.keys(mocks.versions).forEach((key) => {
            delete mocks.versions[key];
        });

        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });
    });

    test("uses last-write-wins checks so stale rollback/error handlers are ignored", async () => {
        const store = createStore();

        const first = store.dispatch(
            removeFromCartApi.endpoints.removeFromCart.initiate("product-1"),
        );
        const second = store.dispatch(
            removeFromCartApi.endpoints.removeFromCart.initiate("product-1"),
        );

        await Promise.resolve();

        expect(mocks.capturedTxns).toHaveLength(2);
        expect(mocks.capturedTxns[0].rollbackOnError?.(new Error("stale failure"))).toBe(false);
        expect(mocks.capturedTxns[1].rollbackOnError?.(new Error("current failure"))).toBe(true);

        expect(() => {
            mocks.capturedTxns[0].onError?.(new Error("stale failure"));
            mocks.capturedTxns[1].onError?.(new Error("current failure"));
        }).not.toThrow();

        mocks.pendingResolves.forEach((resolve) => resolve());
        await Promise.all([first, second]);
    });

    test("treats AbortError as cancel without rollback or controller-side effects", async () => {
        const store = createStore();
        const pending = store.dispatch(
            removeFromCartApi.endpoints.removeFromCart.initiate("product-1"),
        );

        await Promise.resolve();

        expect(mocks.capturedTxns).toHaveLength(1);

        const abortError = new Error("aborted");
        abortError.name = "AbortError";

        expect(mocks.capturedTxns[0].rollbackOnError?.(abortError)).toBe(false);
        mocks.capturedTxns[0].onError?.(abortError);

        mocks.pendingResolves.forEach((resolve) => resolve());
        await pending;
    });
});
