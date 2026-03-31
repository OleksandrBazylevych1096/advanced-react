import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./OrderSummaryCard.module.scss";

export const OrderSummaryCardSkeleton = () => {
    return (
        <Stack gap={12}>
            <Skeleton
                width={172}
                height={32}
                borderRadius={8}
                className={styles.skeletonSummaryTitle}
            />
            <Skeleton width="100%" height={24} borderRadius={8} />
            <Skeleton width="100%" height={24} borderRadius={8} />
            <Skeleton width="100%" height={24} borderRadius={8} />
            <Skeleton width="100%" height={24} borderRadius={8} />
            <Skeleton width="100%" height={24} borderRadius={8} />
            <Skeleton
                width="100%"
                height={32}
                borderRadius={8}
                className={styles.skeletonTotalRow}
            />
        </Stack>
    );
};
