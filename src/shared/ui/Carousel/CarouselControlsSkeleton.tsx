import {Skeleton} from "@/shared/ui/Skeleton";

import styles from "./Carousel.module.scss";

export const CarouselControlsSkeleton = () => {
    return (
        <div className={styles.emblaButtons}>
            <Skeleton width={40} height={40} borderRadius={40} />
            <Skeleton width={40} height={40} borderRadius={40} />
        </div>
    );
};
