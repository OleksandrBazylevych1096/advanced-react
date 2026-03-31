import {Stack} from "@/shared/ui/Stack";

import styles from "./OrderSummaryCard.module.scss";

export const OrderSummaryCardSkeleton = () => {
    return (
        <Stack gap={12}>
            <div className={styles.skeletonSummaryTitle} />
            <div className={styles.skeletonSummaryRow} />
            <div className={styles.skeletonSummaryRow} />
            <div className={styles.skeletonSummaryRow} />
            <div className={styles.skeletonSummaryRow} />
            <div className={styles.skeletonSummaryRow} />
            <div className={styles.skeletonTotalRow} />
        </Stack>
    );
};
