import styles from "./ProductImageCarousel.module.scss";

export const ProductImageCarouselSkeleton = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.mainCarousel}>
                <div className={styles.skeletonMainSlide} />
            </div>
            <div className={styles.thumbnailsContainer}>
                {Array.from({length: 4}).map((_, index) => (
                    <div key={index} className={styles.skeletonThumb} />
                ))}
            </div>
        </div>
    );
};
