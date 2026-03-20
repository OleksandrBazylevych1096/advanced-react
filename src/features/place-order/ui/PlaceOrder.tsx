import {useTranslation} from "react-i18next";

import type {DeliverySelection} from "@/features/choose-delivery-date/@x/deliverySelectionTypes.ts";
import type {CheckoutSummary} from "@/features/place-order/types/checkoutTypes.ts";

import {Button, Stack, Typography} from "@/shared/ui";

import {usePlaceOrderController} from "../model/controllers/usePlaceOrderController/usePlaceOrderController.ts";

interface PlaceOrderProps {
    summary: CheckoutSummary | undefined;
    deliverySelection: DeliverySelection | null;
    tip: number;
    couponCode: string;
}

export const PlaceOrder = ({summary, deliverySelection, tip, couponCode}: PlaceOrderProps) => {
    const {t} = useTranslation("checkout");
    const {
        data: {paymentSessionError},
        status: {isPlacingOrder, canProceedToStripe},
        actions: {proceedToStripeCheckout},
    } = usePlaceOrderController({
        summary,
        deliverySelection,
        tip,
        couponCode,
    });

    return (
        <Stack gap={8}>
            <Button
                type="button"
                size="lg"
                theme="primary"
                onClick={proceedToStripeCheckout}
                fullWidth
                disabled={!canProceedToStripe || isPlacingOrder}
            >
                {isPlacingOrder ? t("preparingPayment") : t("proceedToStripe")}
            </Button>
            {paymentSessionError && <Typography tone="danger">{paymentSessionError}</Typography>}
        </Stack>
    );
};
