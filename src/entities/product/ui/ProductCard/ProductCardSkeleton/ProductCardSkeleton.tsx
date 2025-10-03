import { cn } from "@/shared/lib";

import styles from "./ProductCardSkeleton.module.scss";

interface ProductCardSkeletonProps {
  className?: string;
}

export const ProductCardSkeleton = ({
  className,
}: ProductCardSkeletonProps) => {
  return (
    <div className={cn(styles.skeleton, className)}>
      <div className={styles.imgContainer}>
        <div className={styles.imgSkeleton} />
        <div className={styles.buttonSkeleton} />
      </div>
      <div className={styles.content}>
        <div className={styles.titleSkeleton} />
        <div className={styles.subtitleSkeleton} />
        <div className={styles.prices}>
          <div className={styles.priceSkeleton} />
          <div className={styles.oldPriceSkeleton} />
        </div>
        <div className={styles.amountLeftSkeleton} />
      </div>
    </div>
  );
};
