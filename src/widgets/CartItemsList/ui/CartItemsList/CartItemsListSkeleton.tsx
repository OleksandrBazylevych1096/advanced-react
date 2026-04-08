import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./CartItemsList.module.scss";

interface CartItemsSkeletonProps {
    compact?: boolean;
}

export const CartItemsListSkeleton = ({compact = false}: CartItemsSkeletonProps) => {
    return (
        <Stack className={styles.root}>
            <Stack className={styles.panelHeader}>
                <Skeleton width={148} height={28} borderRadius={8} />
                <Skeleton width={72} height={20} shape="circle" />
            </Stack>

            {Array.from({length: compact ? 3 : 4}).map((_, index) => (
                <div key={`cart-item-skeleton-${index}`} className={styles.rowSkeleton}>
                    <Skeleton
                        width={64}
                        height={64}
                        borderRadius={16}
                        className={styles.imageSkeleton}
                    />

                    <div className={styles.infoSkeleton}>
                        <Skeleton
                            width="85%"
                            height={16}
                            borderRadius={8}
                            className={styles.nameSkeleton}
                        />
                        <Skeleton width={112} height={16} borderRadius={8} />
                    </div>

                    <div className={styles.controlsSkeleton}>
                        <Skeleton width={28} height={28} shape="circle" />
                        <Skeleton width={92} height={32} borderRadius={16} />
                    </div>

                    {!compact && (
                        <Skeleton
                            width={88}
                            height={20}
                            borderRadius={8}
                            className={styles.totalSkeleton}
                        />
                    )}
                </div>
            ))}
        </Stack>
    );
};
