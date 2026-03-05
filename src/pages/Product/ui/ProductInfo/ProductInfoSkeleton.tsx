import styles from "./ProductInfo.module.scss";

export const ProductInfoSkeleton = () => {
    return (
        <div className={styles.skeleton} data-testid="product-info-skeleton">
            <div className={styles.titleSkeleton} />
            <div className={styles.subtitleSkeleton} />
            <div className={styles.prices}>
                <div className={styles.priceSkeleton} />
                <div className={styles.oldPriceSkeleton} />
            </div>
            <div className={styles.metadata}>
                <div className={styles.amountLeftSkeleton} />
            </div>
            <div className={styles.buttonSkeleton} />
        </div>
    );
};
