export interface CartQuantityEngineSessionState {
    confirmedQuantity: number;
    desiredQuantity: number;
    inFlightQuantity: number | null;
}

interface MarkSuccessResult {
    hasConverged: boolean;
}

interface RollbackResult {
    didChange: boolean;
    rollbackQuantity: number;
}

interface ClearInFlightResult {
    needsFollowUpFlush: boolean;
}

export interface CartQuantityEngine {
    ensureSession: (productId: string, confirmedQuantity: number, desiredQuantity: number) => void;
    setDesiredQuantity: (productId: string, quantity: number) => void;
    startFlush: (productId: string) => number | null;
    markSuccess: (productId: string) => MarkSuccessResult | null;
    rollbackToConfirmed: (productId: string) => RollbackResult | null;
    clearInFlight: (productId: string) => ClearInFlightResult | null;
    removeSession: (productId: string) => void;
    reset: () => void;
}

export const createCartQuantityEngine = (): CartQuantityEngine => {
    const sessions = new Map<string, CartQuantityEngineSessionState>();

    const getSession = (productId: string) => sessions.get(productId);

    const ensureSession = (
        productId: string,
        confirmedQuantity: number,
        desiredQuantity: number,
    ) => {
        if (sessions.has(productId)) return;

        sessions.set(productId, {
            confirmedQuantity,
            desiredQuantity,
            inFlightQuantity: null,
        });
    };

    const setDesiredQuantity = (productId: string, quantity: number) => {
        const session = getSession(productId);
        if (!session) return;

        session.desiredQuantity = quantity;
    };

    const startFlush = (productId: string): number | null => {
        const session = getSession(productId);
        if (!session || session.inFlightQuantity !== null) return null;
        if (session.desiredQuantity === session.confirmedQuantity) return null;

        session.inFlightQuantity = session.desiredQuantity;
        return session.inFlightQuantity;
    };

    const markSuccess = (productId: string): MarkSuccessResult | null => {
        const session = getSession(productId);
        if (!session) return null;

        if (session.inFlightQuantity !== null) {
            session.confirmedQuantity = session.inFlightQuantity;
        }

        return {
            hasConverged: session.desiredQuantity === session.confirmedQuantity,
        };
    };

    const rollbackToConfirmed = (productId: string): RollbackResult | null => {
        const session = getSession(productId);
        if (!session) return null;

        const didChange = session.desiredQuantity !== session.confirmedQuantity;
        const rollbackQuantity = session.confirmedQuantity;

        session.desiredQuantity = session.confirmedQuantity;

        return {
            didChange,
            rollbackQuantity,
        };
    };

    const clearInFlight = (productId: string): ClearInFlightResult | null => {
        const session = getSession(productId);
        if (!session) return null;

        session.inFlightQuantity = null;

        return {
            needsFollowUpFlush: session.desiredQuantity !== session.confirmedQuantity,
        };
    };

    const removeSession = (productId: string) => {
        sessions.delete(productId);
    };

    const reset = () => {
        sessions.clear();
    };

    return {
        ensureSession,
        setDesiredQuantity,
        startFlush,
        markSuccess,
        rollbackToConfirmed,
        clearInFlight,
        removeSession,
        reset,
    };
};
