import {Stack} from "@/shared/ui";

import styles from "./CheckoutSidebar.module.scss";

export const CheckoutSidebarSkeleton = () => {
    return (
        <Stack gap={16} className={styles.column}>
            <Stack gap={12} className={styles.summarySection}>
                <div className={styles.skeletonSummaryTitle} />
                <div className={styles.skeletonSummaryRow} />
                <div className={styles.skeletonSummaryRow} />
                <div className={styles.skeletonSummaryRow} />
                <div className={styles.skeletonSummaryRow} />
                <div className={styles.skeletonSummaryRow} />
                <div className={styles.skeletonTotalRow} />
            </Stack>

            <Stack gap={12}>
                <div className={styles.skeletonBlockTitle} />
                <Stack direction="row" gap={6} className={styles.skeletonChipRow}>
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                </Stack>
                <Stack direction="row" gap={6} className={styles.skeletonChipRow}>
                    <div className={styles.skeletonChip} />
                </Stack>
            </Stack>

            <Stack gap={12}>
                <div className={styles.skeletonBlockTitle} />
                <div className={styles.skeletonCouponButton} />
            </Stack>

            <div className={styles.skeletonButton} />
        </Stack>
    );
};
