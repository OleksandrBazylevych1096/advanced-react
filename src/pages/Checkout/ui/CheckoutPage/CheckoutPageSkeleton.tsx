import {ReviewOrderItemsSkeleton} from "@/widgets/ReviewOrderItems";

import {OrderSummaryCardSkeleton} from "@/entities/order";

import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./CheckoutPage.module.scss";

export const CheckoutPageSkeleton = () => {
    return (
        <Stack as="section" className={styles.layout} gap={24}>
            <Stack className={styles.mainColumn} gap={24}>
                <Stack direction="row" align="center" gap={12}>
                    <Skeleton width={56} height={56} shape="circle" />
                    <Skeleton width="60%" height={32} borderRadius={8} />
                </Stack>

                <Stack className={styles.cardSurface} gap={16}>
                    <Skeleton width={140} height={32} borderRadius={8} />
                    <Stack direction="row" align="center" gap={12}>
                        <Skeleton width={84} height={20} borderRadius={40} />
                        <Skeleton width="70%" height={24} borderRadius={8} />
                    </Stack>
                    <Stack direction="row" align="center" gap={12}>
                        <Skeleton width={84} height={20} borderRadius={40} />
                        <Skeleton width={172} height={24} borderRadius={8} />
                    </Stack>
                </Stack>

                <Stack className={styles.cardSurface}>
                    <ReviewOrderItemsSkeleton />
                </Stack>
            </Stack>

            <Stack gap={16} className={styles.sidebarColumn}>
                <Stack className={styles.cardSurface}>
                    <OrderSummaryCardSkeleton />
                </Stack>

                <Stack gap={12} className={styles.cardSurface}>
                    <Skeleton width={120} height={32} borderRadius={8} />
                    <Stack direction="row" gap={6} className={styles.skeletonChipRow}>
                        <Skeleton width={80} height={40} borderRadius={40} />
                        <Skeleton width={80} height={40} borderRadius={40} />
                        <Skeleton width={80} height={40} borderRadius={40} />
                    </Stack>
                    <Stack direction="row" gap={6} className={styles.skeletonChipRow}>
                        <Skeleton width={80} height={40} borderRadius={40} />
                        <Skeleton width={80} height={40} borderRadius={40} />
                    </Stack>
                </Stack>

                <Stack gap={12} className={styles.cardSurface}>
                    <Skeleton width={120} height={32} borderRadius={8} />
                    <Skeleton width={124} height={32} borderRadius={40} />
                </Stack>

                <Stack className={styles.cardSurface}>
                    <Skeleton width="100%" height={60} borderRadius={40} />
                </Stack>
            </Stack>
        </Stack>
    );
};
