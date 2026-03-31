import {Stack} from "@/shared/ui/Stack";

import pageStyles from "../OrderPage.module.scss";

import styles from "./OrderTrackingSection.module.scss";

export const OrderTrackingSectionSkeleton = () => {
    return (
        <Stack className={`${pageStyles.cardSurface} ${styles.trackingCard}`} gap={16}>
            <Stack direction="row" justify="space-between" align="flex-start" gap={12}>
                <Stack gap={8}>
                    <div className={styles.skeletonTrackingOrderNumber} />
                    <div className={styles.skeletonTrackingDeliveryLabel} />
                </Stack>
                <div className={styles.skeletonStatusPill} />
            </Stack>

            <Stack className={styles.currentStatus} gap={12} align="center">
                <div className={styles.skeletonStatusAura} />
                <div className={styles.skeletonCurrentStatusLabel} />
            </Stack>

            <Stack gap={16} direction="row" className={styles.skeletonTimelineGrid}>
                <Stack className={styles.skeletonTimelineRow}>
                    <div className={styles.skeletonTimelineTrack} />
                    <Stack direction="row" align="center" gap={8}>
                        <div className={styles.skeletonTimelineMarker} />
                        <div className={styles.skeletonTimelineLabel} />
                    </Stack>
                </Stack>
                <Stack className={styles.skeletonTimelineRow}>
                    <div className={styles.skeletonTimelineTrack} />
                    <Stack direction="row" align="center" gap={8}>
                        <div className={styles.skeletonTimelineMarker} />
                        <div className={styles.skeletonTimelineLabel} />
                    </Stack>
                </Stack>
                <Stack className={styles.skeletonTimelineRow}>
                    <div className={styles.skeletonTimelineTrack} />
                    <Stack direction="row" align="center" gap={8}>
                        <div className={styles.skeletonTimelineMarker} />
                        <div className={styles.skeletonTimelineLabel} />
                    </Stack>
                </Stack>
                <Stack className={styles.skeletonTimelineRow}>
                    <div className={styles.skeletonTimelineTrack} />
                    <Stack direction="row" align="center" gap={8}>
                        <div className={styles.skeletonTimelineMarker} />
                        <div className={styles.skeletonTimelineLabel} />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};
