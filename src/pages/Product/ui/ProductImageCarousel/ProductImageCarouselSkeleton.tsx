import {Skeleton} from "@/shared/ui/Skeleton";

import styles from "./ProductImageCarousel.module.scss";

export const ProductImageCarouselSkeleton = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.mainCarousel}>
                <Skeleton width="100%" height={552} borderRadius={8} />
            </div>
            <div className={styles.thumbnailsContainer}>
                {Array.from({length: 4}).map((_, index) => (
                    <Skeleton
                        key={index}
                        width={96}
                        height={96}
                        borderRadius={16}
                        className={styles.skeletonThumb}
                    />
                ))}
            </div>
        </div>
    );
};
