import {Coupon} from "@/features/checkout/apply-coupon";
import {DeliveryTip} from "@/features/checkout/choose-delivery-tip";
import {PlaceOrder} from "@/features/checkout/place-order";

import {OrderSummaryCard} from "@/entities/order";

import {Stack} from "@/shared/ui/Stack";

import {useCheckoutSidebarController} from "../../state/controllers/useCheckoutSidebarController/useCheckoutSidebarController";

import styles from "./CheckoutSidebar.module.scss";
import {CheckoutSidebarSkeleton} from "./CheckoutSidebarSkeleton";

export const CheckoutSidebar = () => {
    const {
        data: {orderSummaryRows, totalAmount, summaryTitle, summaryTotalLabel, placeOrder},
        status: {isSummaryLoading},
    } = useCheckoutSidebarController();

    if (isSummaryLoading) {
        return <CheckoutSidebarSkeleton />;
    }

    return (
        <Stack gap={16} className={styles.column}>
            <OrderSummaryCard
                rows={orderSummaryRows}
                totalAmount={totalAmount}
                title={summaryTitle}
                totalLabel={summaryTotalLabel}
            />
            <DeliveryTip />
            <Coupon />
            <PlaceOrder
                summary={placeOrder.summary}
                deliverySelection={placeOrder.deliverySelection}
                tip={placeOrder.tip}
                couponCode={placeOrder.couponCode}
            />
        </Stack>
    );
};

