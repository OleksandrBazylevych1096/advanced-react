import {beforeEach, describe, expect, test, vi} from "vitest";

import {createStore} from "@/app/store/setup/store";

const mocks = vi.hoisted(() => {
    const capturedTxns: Array<{
        rollbackOnError?: (error: unknown) => boolean;
        onError?: (error: unknown) => void;
    }> = [];
    const pendingResolves: Array<() => void> = [];
    const versions: Record<string, number | undefined> = {};

    const addToastMock = vi.fn(
        (payload: {message: string; type: "error" | "info" | "success" | "warning"}) => ({
            type: "toast/addToast",
            payload,
        }),
    );

    const shippingGuardMock = {
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
        addToastMock,
        capturedTxns,
        pendingResolves,
        versions,
        shippingGuardMock,
        runOptimisticTxnMock,
    };
});

vi.mock("@/shared/lib/notifications", async () => {
    const actual = await vi.importActual<typeof import("@/shared/lib/notifications")>(
        "@/shared/lib/notifications",
    );

    return {
        ...actual,
        toastActions: {
            addToast: mocks.addToastMock,
        },
    };
});

vi.mock("@/shared/lib/state", () => ({
    runOptimisticTxn: mocks.runOptimisticTxnMock,
    createVersionGuard: () => ({
        next: () => 1,
        isCurrent: () => true,
        clear: () => undefined,
    }),
}));

vi.mock("@/shared/lib/errors", () => ({
    isAbortError: (error: unknown) => error instanceof Error && error.name === "AbortError",
}));

vi.mock("@/entities/shipping-address", async () => {
    const actual = await vi.importActual<typeof import("@/entities/shipping-address")>(
        "@/entities/shipping-address",
    );

    return {
        ...actual,
        SHIPPING_ADDRESSES_DOMAIN_KEY: "shipping-addresses-domain",
        shippingAddressOptimisticVersionGuard: mocks.shippingGuardMock,
    };
});

describe("deleteShippingAddressApi", () => {
    let deleteShippingAddressApi: typeof import("./deleteShippingAddressApi").deleteShippingAddressApi;

    beforeEach(async () => {
        vi.clearAllMocks();
        mocks.capturedTxns.length = 0;
        mocks.pendingResolves.length = 0;
        Object.keys(mocks.versions).forEach((key) => {
            delete mocks.versions[key];
        });

        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        ({deleteShippingAddressApi} = await import("./deleteShippingAddressApi"));
    });

    test("ignores stale rollback and stale error toast", async () => {
        const store = createStore();

        const first = store.dispatch(
            deleteShippingAddressApi.endpoints.deleteShippingAddress.initiate({
                id: "a1",
            }),
        );
        const second = store.dispatch(
            deleteShippingAddressApi.endpoints.deleteShippingAddress.initiate({
                id: "a2",
            }),
        );

        await vi.waitFor(() => {
            expect(mocks.capturedTxns).toHaveLength(2);
        });
        expect(mocks.capturedTxns[0].rollbackOnError?.(new Error("stale failure"))).toBe(false);
        expect(mocks.capturedTxns[1].rollbackOnError?.(new Error("current failure"))).toBe(true);

        mocks.capturedTxns[0].onError?.(new Error("stale failure"));
        expect(mocks.addToastMock).not.toHaveBeenCalled();

        mocks.capturedTxns[1].onError?.(new Error("current failure"));
        expect(mocks.addToastMock).toHaveBeenCalledTimes(1);
        expect(mocks.addToastMock).toHaveBeenCalledWith({
            message: "Failed to delete address. Please try again.",
            type: "error",
        });

        mocks.pendingResolves.forEach((resolve) => resolve());
        await Promise.all([first, second]);
    });

    test("treats AbortError as cancel without rollback or toast", async () => {
        const store = createStore();
        const pending = store.dispatch(
            deleteShippingAddressApi.endpoints.deleteShippingAddress.initiate({
                id: "a1",
            }),
        );

        await vi.waitFor(() => {
            expect(mocks.capturedTxns).toHaveLength(1);
        });

        const abortError = new Error("aborted");
        abortError.name = "AbortError";

        expect(mocks.capturedTxns[0].rollbackOnError?.(abortError)).toBe(false);
        mocks.capturedTxns[0].onError?.(abortError);
        expect(mocks.addToastMock).not.toHaveBeenCalled();

        mocks.pendingResolves.forEach((resolve) => resolve());
        await pending;
    });

    test("uses shared concurrency guard key with other shipping-address mutations", async () => {
        const store = createStore();
        mocks.shippingGuardMock.next("shipping-addresses-domain");
        const deletePending = store.dispatch(
            deleteShippingAddressApi.endpoints.deleteShippingAddress.initiate({
                id: "a2",
            }),
        );

        await vi.waitFor(() => {
            expect(mocks.capturedTxns).toHaveLength(1);
        });

        expect(mocks.shippingGuardMock.next).toHaveBeenNthCalledWith(
            1,
            "shipping-addresses-domain",
        );
        expect(mocks.shippingGuardMock.next).toHaveBeenNthCalledWith(
            2,
            "shipping-addresses-domain",
        );
        expect(mocks.capturedTxns[0].rollbackOnError?.(new Error("current failure"))).toBe(true);

        mocks.pendingResolves.forEach((resolve) => resolve());
        await deletePending;
    });
});
