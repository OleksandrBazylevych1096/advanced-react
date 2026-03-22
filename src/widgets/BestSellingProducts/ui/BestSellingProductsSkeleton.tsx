import styles from "@/widgets/BestSellingProducts/ui/BestSellingProducts.module.scss";

import {ProductCardSkeleton} from "@/entities/product";

import {CarouselSkeleton,CarouselControlsSkeleton} from "@/shared/ui/Carousel";
import {Stack} from "@/shared/ui/Stack";

export const BestSellingProductsSkeleton = () => {
    return (
        <section className={styles.section}>
            <Stack className={styles.header} direction="row" align="center" justify="space-between">
                <div className={styles.titleSkeleton} />
                <Stack direction="row" gap={16} align="center">
                    <div className={styles.buttonSkeleton} />
                    <CarouselControlsSkeleton />
                </Stack>
            </Stack>
            <CarouselSkeleton count={20} ItemSkeletonComponent={<ProductCardSkeleton />} />
        </section>
    );
};

