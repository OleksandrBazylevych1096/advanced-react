export type UndoablePatch = {
    undo: () => void;
};
export type OptimisticTxnResult<T> = {ok: true; data: T} | {ok: false; error: unknown};

type MaybePatch = UndoablePatch | null | undefined;
type RollbackPolicy = boolean | ((error: unknown) => boolean);
const DEFAULT_MIN_VISIBLE_BEFORE_ROLLBACK_MS = 500;

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

const toPatchList = (patches: MaybePatch | MaybePatch[]): UndoablePatch[] => {
    const list = Array.isArray(patches) ? patches : [patches];
    return list.filter((patch): patch is UndoablePatch => Boolean(patch));
};

const shouldRollback = (policy: RollbackPolicy | undefined, error: unknown): boolean => {
    if (typeof policy === "function") {
        return policy(error);
    }

    if (typeof policy === "boolean") {
        return policy;
    }

    return true;
};

export interface OptimisticTxn {
    apply: () => MaybePatch | MaybePatch[];
    rollbackOnError?: RollbackPolicy;
    onError?: (error: unknown) => void;
    minVisibleMsBeforeRollback?: number;
}

export const runOptimisticTxn = async <T>(
    txn: OptimisticTxn,
    request: () => Promise<T>,
): Promise<OptimisticTxnResult<T>> => {
    const patches = toPatchList(txn.apply());
    const startedAt = Date.now();

    try {
        const data = await request();
        return {ok: true, data};
    } catch (error) {
        if (shouldRollback(txn.rollbackOnError, error)) {
            const minVisibleMs = Math.max(
                0,
                txn.minVisibleMsBeforeRollback ?? DEFAULT_MIN_VISIBLE_BEFORE_ROLLBACK_MS,
            );
            const elapsedMs = Date.now() - startedAt;
            const remainingMs = minVisibleMs - elapsedMs;

            if (remainingMs > 0) {
                await sleep(remainingMs);
            }

            for (let i = patches.length - 1; i >= 0; i -= 1) {
                patches[i].undo();
            }
        }

        txn.onError?.(error);
        return {ok: false, error};
    }
};
