import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./ProductInfo.module.scss";

export const ProductInfoSkeleton = () => {
    return (
        <Stack className={styles.skeleton} gap={0} data-testid="product-info-skeleton">
            <Skeleton width="70%" height={40} borderRadius={8} className={styles.titleSkeleton} />
            <Skeleton
                width="90%"
                height={32}
                borderRadius={8}
                className={styles.subtitleSkeleton}
            />
            <Stack direction="row" align="center" className={styles.prices}>
                <Skeleton width={100} height={40} borderRadius={8} />
                <Skeleton width={72} height={32} borderRadius={8} />
            </Stack>
            <Stack className={styles.metadata} direction="row">
                <Skeleton width={80} height={20} borderRadius={8} />
            </Stack>
            <Skeleton width="100%" height={60} borderRadius={16} />
        </Stack>
    );
};
