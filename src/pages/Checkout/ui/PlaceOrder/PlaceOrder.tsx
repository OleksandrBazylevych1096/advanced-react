import {useTranslation} from "react-i18next";

import type {DeliverySelection} from "@/features/choose-delivery-date/@x/checkout/place-order";

import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import type {CheckoutSummary} from "../../model/types/checkoutTypes.ts";

import {usePlaceOrder} from "./usePlaceOrder/usePlaceOrder.ts";

interface PlaceOrderProps {
    summary: CheckoutSummary | undefined;
    deliverySelection: DeliverySelection | null | undefined;
    tip: number;
    couponCode: string;
}

export const PlaceOrder = ({summary, deliverySelection, tip, couponCode}: PlaceOrderProps) => {
    const {t} = useTranslation("checkout");
    const {
        data: {paymentSessionError},
        status: {isPlacingOrder, canProceedToStripe},
        actions: {proceedToStripeCheckout},
    } = usePlaceOrder({
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
                data-testid="checkout-place-order"
            >
                {isPlacingOrder ? t("preparingPayment") : t("proceedToStripe")}
            </Button>
            {paymentSessionError && (
                <Typography tone="danger" data-testid="checkout-payment-session-error">
                    {paymentSessionError}
                </Typography>
            )}
        </Stack>
    );
};
