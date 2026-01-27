import styles from "./Carousel.module.scss";

export const CarouselControlsSkeleton = () => {
    return (
        <div className={styles.emblaButtons}>
            <div className={styles.buttonSkeleton}/>
            <div className={styles.buttonSkeleton}/>
        </div>
    );
};
