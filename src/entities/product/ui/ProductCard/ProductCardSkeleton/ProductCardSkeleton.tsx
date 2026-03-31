import {cn} from "@/shared/lib/styling";
import {Box} from "@/shared/ui/Box";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./ProductCardSkeleton.module.scss";

interface ProductCardSkeletonProps {
    className?: string;
}

export const ProductCardSkeleton = ({className}: ProductCardSkeletonProps) => {
    return (
        <Stack
            className={cn(styles.skeleton, className)}
            gap={0}
            data-testid="product-card-skeleton"
        >
            <Box className={styles.imgContainer}>
                <Skeleton width="60%" height="60%" borderRadius={16} />
                <Skeleton
                    width={48}
                    height={48}
                    borderRadius={40}
                    className={styles.buttonSkeleton}
                />
            </Box>
            <Stack className={styles.content} gap={0}>
                <Skeleton
                    width="80%"
                    height={20}
                    borderRadius={8}
                    className={styles.titleSkeleton}
                />
                <Skeleton
                    width="60%"
                    height={16}
                    borderRadius={8}
                    className={styles.subtitleSkeleton}
                />
                <Stack direction="row" align="center" className={styles.prices}>
                    <Skeleton width={60} height={20} borderRadius={8} />
                    <Skeleton width={44} height={16} borderRadius={8} />
                </Stack>
                <Skeleton width={48} height={16} borderRadius={8} />
            </Stack>
        </Stack>
    );
};
