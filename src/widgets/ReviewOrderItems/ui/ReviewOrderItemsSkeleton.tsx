import {Stack} from "@/shared/ui/Stack";

import styles from "./ReviewOrderItems.module.scss";

export const ReviewOrderItemsSkeleton = () => {
    return (
        <Stack gap={20}>
            <div className={styles.skeletonReviewTitle} />

            <Stack direction="row" justify="space-between" align="center">
                <div className={styles.skeletonItemsNameLabel} />
                <Stack direction="row" align="center" gap={10}>
                    <div className={styles.skeletonItemsCount} />
                    <div className={styles.skeletonArrow} />
                </Stack>
            </Stack>

            <div className={styles.skeletonDivider} />

            <Stack direction="row" align="center" className={styles.skeletonItemRow}>
                <div className={styles.skeletonItemImage} />
                <Stack gap={8} className={styles.skeletonItemInfo}>
                    <div className={styles.skeletonItemName} />
                    <div className={styles.skeletonItemPrice} />
                </Stack>
                <div className={styles.skeletonItemQty} />
            </Stack>

            <div className={styles.skeletonDivider} />
        </Stack>
    );
};
