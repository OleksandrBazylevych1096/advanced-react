import styles from "@/widgets/TrendingProducts/ui/TrendingProducts.module.scss";

import {ProductCardSkeleton} from "@/entities/product";
import {TagListSkeleton} from "@/entities/tag";

import {CarouselSkeleton, CarouselControlsSkeleton} from "@/shared/ui/Carousel";
import {Stack} from "@/shared/ui/Stack";

export const TrendingProductsSkeleton = () => {
    return (
        <section className={styles.section}>
            <Stack className={styles.header} direction="row" align="center" justify="space-between">
                <div className={styles.titleSkeleton} />
                <Stack direction="row" gap={16} align="center">
                    <div className={styles.buttonSkeleton} />
                    <CarouselControlsSkeleton />
                </Stack>
            </Stack>
            <div className={styles.tagsContainer}>
                <TagListSkeleton count={10} />
            </div>
            <CarouselSkeleton count={10} ItemSkeletonComponent={<ProductCardSkeleton />} />
        </section>
    );
};
