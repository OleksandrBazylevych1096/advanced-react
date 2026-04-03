import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./ReviewOrderItems.module.scss";

export const ReviewOrderItemsSkeleton = () => {
    return (
        <Stack gap={20}>
            <Skeleton width={156} height={32} borderRadius={8} />

            <Stack direction="row" justify="space-between" align="center">
                <Skeleton width={92} height={20} borderRadius={8} />
                <Stack direction="row" align="center" gap={10}>
                    <Skeleton width={88} height={20} borderRadius={8} />
                    <Skeleton width={20} height={20} borderRadius={8} />
                </Stack>
            </Stack>

            <div className={styles.skeletonDivider} />

            <Stack direction="row" align="center" className={styles.skeletonItemRow}>
                <Skeleton
                    width={64}
                    height={64}
                    borderRadius={16}
                    className={styles.skeletonItemImage}
                />
                <Stack gap={8} className={styles.skeletonItemInfo}>
                    <Skeleton width="90%" height={20} borderRadius={8} />
                    <Skeleton width={72} height={20} borderRadius={8} />
                </Stack>
                <Skeleton width={20} height={20} borderRadius={8} />
            </Stack>

            <div className={styles.skeletonDivider} />
        </Stack>
    );
};
