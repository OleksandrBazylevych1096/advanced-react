import {ReviewOrderItemsSkeleton} from "@/widgets/ReviewOrderItems";

import {OrderSummaryCardSkeleton} from "@/entities/order";

import {Stack} from "@/shared/ui/Stack";

import {OrderDeliveryAddressCardSkeleton} from "./OrderDeliveryAddressCard/OrderDeliveryAddressCardSkeleton";
import styles from "./OrderPage.module.scss";
import {OrderPaymentInfoCardSkeleton} from "./OrderPaymentInfoCard/OrderPaymentInfoCardSkeleton";
import {OrderTrackingSectionSkeleton} from "./OrderTrackingSection/OrderTrackingSectionSkeleton";

export const OrderPageSkeleton = () => {
    return (
        <Stack as="section" className={styles.layout} gap={24} data-testid="order-page-skeleton">
            <Stack className={styles.mainColumn} gap={24}>
                <div className={styles.skeletonPageTitle} />

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
