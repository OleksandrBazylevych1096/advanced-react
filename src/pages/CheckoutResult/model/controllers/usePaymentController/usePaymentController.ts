import {useEffect, useRef, useState} from "react";

import {
    useConfirmPaymentFallbackMutation,
    useGetCheckoutPaymentSessionQuery,
} from "@/pages/CheckoutResult/api/checkoutResultApi.ts";
import {
    DECLINED_STATUSES,
    FALLBACK_CONFIRM_DELAY_MS,
    MAX_PENDING_POLLING_MS,
    POLLING_INTERVAL_MS,
    TERMINAL_STATUSES,
} from "@/pages/CheckoutResult/config/consts";
import {resolvePaymentStatus} from "@/pages/CheckoutResult/lib/resolvePaymentStatus";
import {CheckoutSessionStatus} from "@/pages/CheckoutResult/model/types/checkoutResultTypes";

import {clearCartState} from "@/entities/cart";

import {createControllerResult, useAppDispatch} from "@/shared/lib";

interface UsePaymentControllerParams {
    sessionId: string | null;
}

export const usePaymentController = ({sessionId}: UsePaymentControllerParams) => {
    const dispatch = useAppDispatch();

    const [isAttemptsExceeded, setIsAttemptsExceeded] = useState(false);
    const [isPollingEnabled, setIsPollingEnabled] = useState(true);
    const [hasRequestedFallbackConfirm, setHasRequestedFallbackConfirm] = useState(false);

    const hasClearedCartRef = useRef(false);
    const pendingStartedAtRef = useRef<number | null>(null);

    const [confirmPaymentFallback, {isLoading: isFallbackConfirmLoading}] =
        useConfirmPaymentFallbackMutation();

    const {
        data: checkoutSession = null,
        isError,
        isFetching,
        isLoading,
        fulfilledTimeStamp,
        refetch,
    } = useGetCheckoutPaymentSessionQuery(
        {sessionId: sessionId ?? ""},
        {
            skip: !sessionId,
            pollingInterval: isPollingEnabled && !isAttemptsExceeded ? POLLING_INTERVAL_MS : 0,
            refetchOnMountOrArgChange: true,
        },
    );

    const sessionStatus = checkoutSession?.status ?? null;
    const isResolved = sessionStatus === CheckoutSessionStatus.PAID_PAYMENT;
    const isPaymentDeclined = sessionStatus != null && DECLINED_STATUSES.has(sessionStatus);

    const paymentStatus = resolvePaymentStatus(
        checkoutSession?.order?.paymentStatus,
        sessionStatus,
    );

    useEffect(() => {
        setIsAttemptsExceeded(false);
        setIsPollingEnabled(true);
        setHasRequestedFallbackConfirm(false);
        hasClearedCartRef.current = false;

        pendingStartedAtRef.current = sessionId ? Date.now() : null;
    }, [sessionId]);

    useEffect(() => {
        if (!isResolved || hasClearedCartRef.current) return;

        hasClearedCartRef.current = true;
        clearCartState(dispatch, {invalidateCartTags: true});
    }, [dispatch, isResolved]);

    useEffect(() => {
        if (
            isError ||
            isAttemptsExceeded ||
            (sessionStatus != null && TERMINAL_STATUSES.has(sessionStatus))
        ) {
            setIsPollingEnabled(false);
        }
    }, [isAttemptsExceeded, isError, sessionStatus]);

    useEffect(() => {
        if (!sessionId || isResolved || sessionStatus !== CheckoutSessionStatus.PENDING_PAYMENT) {
            if (sessionStatus !== CheckoutSessionStatus.PENDING_PAYMENT) {
                pendingStartedAtRef.current = null;
            }
            return;
        }

        if (pendingStartedAtRef.current === null) {
            pendingStartedAtRef.current = Date.now();
        }

        const elapsedMs = Date.now() - pendingStartedAtRef.current;

        if (!hasRequestedFallbackConfirm && elapsedMs >= FALLBACK_CONFIRM_DELAY_MS) {
            setHasRequestedFallbackConfirm(true);
            confirmPaymentFallback({sessionId})
                .unwrap()
                .catch((err: unknown) => {
                    console.error(err);
                })
                .finally(() => {
                    void refetch();
                });
            return;
        }

        if (elapsedMs >= MAX_PENDING_POLLING_MS) {
            setIsAttemptsExceeded(true);
        }
    }, [
        confirmPaymentFallback,
        fulfilledTimeStamp,
        hasRequestedFallbackConfirm,
        isResolved,
        refetch,
        sessionId,
        sessionStatus,
    ]);

    const isSystemError = isError || isAttemptsExceeded;

    const isPolling =
        Boolean(sessionId) &&
        !isResolved &&
        !isPaymentDeclined &&
        !isSystemError &&
        (isFallbackConfirmLoading ||
            sessionStatus === CheckoutSessionStatus.PENDING_PAYMENT ||
            (sessionStatus === null && (isLoading || isFetching)));

    return createControllerResult({
        data: {
            checkoutSession,
            orderDetails: checkoutSession?.order ?? null,
            paymentStatus,
        },
        status: {
            isPolling,
            isResolved,
            isPaymentDeclined,
            isSystemError,
            isFailed: isPaymentDeclined,
        },
    });
};
