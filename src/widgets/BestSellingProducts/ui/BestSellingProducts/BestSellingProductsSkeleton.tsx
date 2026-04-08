import styles from "@/widgets/BestSellingProducts/ui/BestSellingProducts/BestSellingProducts.module.scss";

import {ProductCardSkeleton} from "@/entities/product";

import {CarouselControlsSkeleton, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

export const BestSellingProductsSkeleton = () => {
    return (
        <section className={styles.section}>
            <Stack className={styles.header} direction="row" align="center" justify="space-between">
                <Skeleton width={352} height={40} borderRadius={8} />
                <Stack direction="row" gap={16} align="center">
                    <Skeleton width={148} height={40} borderRadius={8} />
                    <CarouselControlsSkeleton />
                </Stack>
            </Stack>
            <CarouselSkeleton count={20} ItemSkeletonComponent={<ProductCardSkeleton />} />
        </section>
    );
};
