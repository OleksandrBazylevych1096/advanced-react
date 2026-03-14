import {Stack} from "@/shared/ui";

import styles from "./CartItems.module.scss";

interface CartItemsSkeletonProps {
    compact?: boolean;
}

export const CartItemsSkeleton = ({compact = false}: CartItemsSkeletonProps) => {
    return (
        <Stack className={styles.root}>
            <Stack className={styles.panelHeader}>
                <div className={styles.titleSkeleton} />
                <div className={styles.counterSkeleton} />
            </Stack>

            {Array.from({length: compact ? 3 : 4}).map((_, index) => (
                <div key={`cart-item-skeleton-${index}`} className={styles.rowSkeleton}>
                    <div className={styles.imageSkeleton} />

                    <div className={styles.infoSkeleton}>
                        <div className={styles.nameSkeleton} />
                        <div className={styles.priceSkeleton} />
                    </div>

                    <div className={styles.controlsSkeleton}>
                        <div className={styles.iconSkeleton} />
                        <div className={styles.stepperSkeleton} />
                    </div>

                    {!compact && <div className={styles.totalSkeleton} />}
                </div>
            ))}
        </Stack>
    );
};
