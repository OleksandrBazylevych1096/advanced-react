import {ReviewOrderItemsSkeleton} from "@/widgets/ReviewOrderItems";

import {OrderSummaryCardSkeleton} from "@/entities/order";

import {cn} from "@/shared/lib/styling";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import {OrderDeliveryAddressCardSkeleton} from "../OrderDeliveryAddressCard/OrderDeliveryAddressCardSkeleton";
import {OrderPaymentInfoCardSkeleton} from "../OrderPaymentInfoCard/OrderPaymentInfoCardSkeleton";
import {OrderTrackingSectionSkeleton} from "../OrderTrackingSection/OrderTrackingSectionSkeleton";

import styles from "./OrderPage.module.scss";

export const OrderPageSkeleton = () => {
    return (
        <Stack
            as="section"
            className={cn(styles.layout, styles.pageLayout)}
            gap={24}
            data-testid="order-page-skeleton"
        >
            <Stack className={styles.mainColumn} gap={24}>
                <Stack gap={8} direction="row" align="center">
                    <Skeleton width={56} height={56} borderRadius={999} />
                    <Skeleton width={250} height={40} borderRadius={8} />
                </Stack>

                <OrderTrackingSectionSkeleton />

                <Stack className={styles.cardSurface}>
                    <ReviewOrderItemsSkeleton />
                </Stack>
            </Stack>

            <Stack gap={16} className={styles.sidebarColumn}>
                <Stack className={styles.cardSurface}>
                    <OrderSummaryCardSkeleton />
                </Stack>
                <OrderPaymentInfoCardSkeleton />
                <OrderDeliveryAddressCardSkeleton />
            </Stack>
        </Stack>
    );
};
