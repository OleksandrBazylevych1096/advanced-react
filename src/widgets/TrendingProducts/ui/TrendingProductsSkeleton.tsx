import styles from "@/widgets/TrendingProducts/ui/TrendingProducts.module.scss";

import {ProductCardSkeleton} from "@/entities/product";
import {TagListSkeleton} from "@/entities/tag/ui/TagList/TagListSkeleton.tsx";

import {CarouselSkeleton} from "@/shared/ui";
import {CarouselControlsSkeleton} from "@/shared/ui/Carousel/CarouselControlsSkeleton.tsx";


export const TrendingProductsSkeleton = () => {
    return <section className={styles.section}>
        <div className={styles.header}>
            <div className={styles.titleSkeleton}/>
            <div className={styles.controls}>
                <div className={styles.buttonSkeleton}/>
                <CarouselControlsSkeleton/>
            </div>
        </div>
        <div className={styles.tagsContainer}>
            <TagListSkeleton count={10}/>
        </div>
        <CarouselSkeleton count={10} ItemSkeletonComponent={<ProductCardSkeleton/>}/>
    </section>
}