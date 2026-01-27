import styles from "@/widgets/BestSellingProducts/ui/BestSellingProducts.module.scss";

import {ProductCardSkeleton} from "@/entities/product";

import {CarouselSkeleton} from "@/shared/ui";
import {CarouselControlsSkeleton} from "@/shared/ui/Carousel/CarouselControlsSkeleton.tsx";

export const BestSellingProductsSkeleton = () => {
    return <section className={styles.section}>
        <div className={styles.header}>
            <div className={styles.titleSkeleton}/>
            <div className={styles.controls}>
                <div className={styles.buttonSkeleton}/>
                <CarouselControlsSkeleton/>
            </div>
        </div>
        <CarouselSkeleton count={10} ItemSkeletonComponent={<ProductCardSkeleton/>}/>
    </section>
}