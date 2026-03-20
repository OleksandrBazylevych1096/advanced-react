import {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";

import type {DeliverySelection} from "@/features/choose-delivery-date/@x/deliverySelectionTypes.ts";
import {buildPlaceOrderPayload} from "@/features/place-order/lib/transform/buildPlaceOrderPayload.ts";
import type {CheckoutSummary} from "@/features/place-order/types/checkoutTypes.ts";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectUserCurrency} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {createControllerResult, useAppSelector, useLocalizedRoutePath} from "@/shared/lib";

import {useCreatePaymentSessionMutation} from "../../../api/checkoutApi/checkoutApi.ts";
import {checkIsCheckoutReady} from "../../../lib/validation/checkIsCheckoutReady.ts";

interface UsePlaceOrderControllerParams {
    summary: CheckoutSummary | undefined;
    deliverySelection: DeliverySelection | null;
    tip: number;
    couponCode: string;
}

interface SubmitOrderResult {
    sessionId: string;
    clientSecret: string;
    checkoutUrl?: string;
}

export const usePlaceOrderController = ({
    summary,
    deliverySelection,
    tip,
    couponCode,
}: UsePlaceOrderControllerParams) => {
    const {i18n, t} = useTranslation("checkout");
    const getLocalizedPath = useLocalizedRoutePath();
    const currency = useAppSelector(selectUserCurrency);
    const [createPaymentSessionRequest, {isLoading: isPlacingOrder}] =
        useCreatePaymentSessionMutation();
    const [paymentSessionError, setPaymentSessionError] = useState<string | null>(null);
    const {data: defaultAddress} = useGetDefaultShippingAddressQuery(undefined);
    const hasAddress = Boolean(defaultAddress);
    const canPlaceOrder = checkIsCheckoutReady(summary, hasAddress);
    const hasDeliverySelection = Boolean(
        deliverySelection?.deliveryDate && deliverySelection?.deliveryTime,
    );
    const canProceedToStripe = canPlaceOrder && hasDeliverySelection;

    const submitOrder = useCallback(async (): Promise<SubmitOrderResult> => {
        if (!defaultAddress || !canPlaceOrder) {
            throw new Error("Checkout is not ready");
        }

        const successUrl = `${window.location.origin}${getLocalizedPath(
            routePaths[AppRoutes.CHECKOUT_RESULT],
        )}`;
        const cancelUrl = `${window.location.origin}${getLocalizedPath(
            routePaths[AppRoutes.CHECKOUT],
        )}`;

        const payload = buildPlaceOrderPayload(defaultAddress, deliverySelection);
        const response = await createPaymentSessionRequest({
            ...payload,
            locale: i18n.language,
            currency: currency.toLowerCase(),
            tipAmount: tip,
            couponCode,
            successUrl,
            cancelUrl,
        }).unwrap();

        return {
            sessionId: response.sessionId,
            clientSecret: response.stripeClientSecret,
            checkoutUrl: response.checkoutUrl,
        };
    }, [
        canPlaceOrder,
        createPaymentSessionRequest,
        currency,
        defaultAddress,
        deliverySelection,
        getLocalizedPath,
        i18n.language,
        tip,
        couponCode,
    ]);

    const proceedToStripeCheckout = useCallback(async () => {
        if (isPlacingOrder || !canProceedToStripe) return;

        setPaymentSessionError(null);

        try {
            const checkoutUrl = (await submitOrder()).checkoutUrl;
            if (!checkoutUrl) {
                setPaymentSessionError(t("stripeCheckoutUrlMissing"));
                return;
            }

            window.location.assign(checkoutUrl);
        } catch {
            setPaymentSessionError(t("stripeSessionCreateFailed"));
        }
    }, [canProceedToStripe, isPlacingOrder, submitOrder, t]);

    return createControllerResult({
        data: {
            paymentSessionError,
        },
        status: {
            isPlacingOrder,
            canProceedToStripe,
        },
        actions: {
            submitOrder,
            proceedToStripeCheckout,
        },
    });
};
