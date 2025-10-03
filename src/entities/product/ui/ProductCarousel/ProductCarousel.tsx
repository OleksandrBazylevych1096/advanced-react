import type { EmblaCarouselType } from "embla-carousel";
import { useTranslation } from "react-i18next";

import { Button, Carousel, CarouselSkeleton } from "@/shared/ui";

import type { Product } from "../../model/types/Product";
import { ProductCard } from "../ProductCard/ProductCard";
import { ProductCardSkeleton } from "../ProductCard/ProductCardSkeleton/ProductCardSkeleton";

import styles from "./ProductCarousel.module.scss";

interface ProductCarouselProps {
  products?: Product[];
  onEmblaInit: (embla: EmblaCarouselType) => void;
  isLoading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

export const ProductCarousel = (props: ProductCarouselProps) => {
  const { products, onEmblaInit, error, isLoading, onRetry } = props;
  const { t } = useTranslation();
  const handleEmblaInit = (embla: EmblaCarouselType) => {
    onEmblaInit(embla);
  };

  const handleRetry = () => {
    onRetry?.();
  };

  if (isLoading) {
    return <CarouselSkeleton ItemSkeletonComponent={<ProductCardSkeleton />} />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{t("products.unexpectedError")}</p>
        <Button onClick={handleRetry}>{t("products.tryAgain")}</Button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyText}>{t("products.noProducts")}</p>
      </div>
    );
  }

  return (
    <Carousel
      options={{ slidesToScroll: "auto" }}
      onEmblaInit={handleEmblaInit}
    >
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </Carousel>
  );
};
