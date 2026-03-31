import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import pageStyles from "../OrderPage.module.scss";

import styles from "./OrderTrackingSection.module.scss";

export const OrderTrackingSectionSkeleton = () => {
    return (
        <Stack className={`${pageStyles.cardSurface} ${styles.trackingCard}`} gap={16}>
            <Stack direction="row" justify="space-between" align="flex-start" gap={12}>
                <Stack gap={8}>
                    <Skeleton width={180} height={20} borderRadius={8} />
                    <Skeleton width="80%" height={20} borderRadius={8} />
                </Stack>
                <Skeleton width={124} height={40} borderRadius={40} />
            </Stack>

            <Stack className={styles.currentStatus} gap={12} align="center">
                <Skeleton width={96} height={96} shape="circle" />
                <Skeleton width={180} height={28} borderRadius={8} />
            </Stack>

            <Stack gap={16} direction="row" className={styles.skeletonTimelineGrid}>
                <Stack className={styles.skeletonTimelineRow}>
                    <Skeleton width="100%" height={8} shape="circle" />
                    <Stack direction="row" align="center" gap={8}>
                        <Skeleton width={20} height={20} shape="circle" />
                        <Skeleton width="90%" height={20} borderRadius={8} />
                    </Stack>
                </Stack>
                <Stack className={styles.skeletonTimelineRow}>
                    <Skeleton width="100%" height={8} shape="circle" />
                    <Stack direction="row" align="center" gap={8}>
                        <Skeleton width={20} height={20} shape="circle" />
                        <Skeleton width="90%" height={20} borderRadius={8} />
                    </Stack>
                </Stack>
                <Stack className={styles.skeletonTimelineRow}>
                    <Skeleton width="100%" height={8} shape="circle" />
                    <Stack direction="row" align="center" gap={8}>
                        <Skeleton width={20} height={20} shape="circle" />
                        <Skeleton width="90%" height={20} borderRadius={8} />
                    </Stack>
                </Stack>
                <Stack className={styles.skeletonTimelineRow}>
                    <Skeleton width="100%" height={8} shape="circle" />
                    <Stack direction="row" align="center" gap={8}>
                        <Skeleton width={20} height={20} shape="circle" />
                        <Skeleton width="90%" height={20} borderRadius={8} />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};
