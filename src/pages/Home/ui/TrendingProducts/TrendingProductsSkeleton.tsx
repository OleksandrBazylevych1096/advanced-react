import {ProductCardSkeleton} from "@/entities/product";

import {CarouselSkeleton, CarouselControlsSkeleton} from "@/shared/ui/Carousel";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import {TagListSkeleton} from "../TagList/TagListSkeleton";

import styles from "./TrendingProducts.module.scss";

export const TrendingProductsSkeleton = () => {
    return (
        <section className={styles.section}>
            <Stack className={styles.header} direction="row" align="center" justify="space-between">
                <Skeleton width={352} height={40} borderRadius={8} />
                <Stack direction="row" gap={16} align="center">
                    <Skeleton width={148} height={40} borderRadius={8} />
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
