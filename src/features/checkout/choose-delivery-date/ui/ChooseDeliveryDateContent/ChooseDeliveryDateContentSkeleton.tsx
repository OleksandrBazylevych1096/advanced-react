import {Stack} from "@/shared/ui/Stack";

import styles from "./ChooseDeliveryDateContent.module.scss";

export const ChooseDeliveryDateContentSkeleton = () => {
    return (
        <Stack gap={24} className={styles.content} data-testid="delivery-slots-skeleton">
            <Stack gap={12}>
                <div className={styles.skeletonLabel} />
                <Stack direction="row" gap={16} className={styles.dateGrid}>
                    {Array.from({length: 7}).map((_, idx) => (
                        <div key={`day-skeleton-${idx}`} className={styles.dateButtonSkeleton} />
                    ))}
                </Stack>
            </Stack>
            <Stack gap={12}>
                <div className={styles.skeletonLabel} />
                <Stack direction="row" gap={16} className={styles.timeSlots}>
                    {Array.from({length: 4}).map((_, idx) => (
                        <div key={`slot-skeleton-${idx}`} className={styles.timeSlotSkeleton} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};
