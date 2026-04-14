import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import pageStyles from "../OrderPage/OrderPage.module.scss";

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

            <div className={styles.skeletonTimeline}>
                <div className={styles.skeletonTimelineTrack} aria-hidden>
                    <Skeleton width="100%" height={4} borderRadius={999} />
                    <div className={styles.skeletonTimelineMarkers}>
                        <Skeleton width={18} height={18} shape="circle" />
                        <Skeleton width={18} height={18} shape="circle" />
                        <Skeleton width={18} height={18} shape="circle" />
                        <Skeleton width={18} height={18} shape="circle" />
                    </div>
                </div>

                <div className={styles.skeletonTimelineLabels}>
                    <div className={styles.skeletonTimelineLabelCell}>
                        <Skeleton width={96} height={20} borderRadius={8} />
                    </div>
                    <span aria-hidden />
                    <div className={styles.skeletonTimelineLabelCell}>
                        <Skeleton width={88} height={20} borderRadius={8} />
                    </div>
                    <span aria-hidden />
                    <div className={styles.skeletonTimelineLabelCell}>
                        <Skeleton width={72} height={20} borderRadius={8} />
                    </div>
                    <span aria-hidden />
                    <div className={styles.skeletonTimelineLabelCell}>
                        <Skeleton width={80} height={20} borderRadius={8} />
                    </div>
                </div>
            </div>
        </Stack>
    );
};
