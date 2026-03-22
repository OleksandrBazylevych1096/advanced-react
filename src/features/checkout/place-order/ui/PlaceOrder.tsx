import {useTranslation} from "react-i18next";

import type {DeliverySelection} from "@/features/checkout/choose-delivery-date/@x/checkout/place-order";
import type {CheckoutSummary} from "@/features/checkout/place-order/model/types/checkoutTypes.ts";

import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {usePlaceOrderController} from "../state/controllers/usePlaceOrderController/usePlaceOrderController.ts";

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


