import type { EmblaCarouselType } from "embla-carousel";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ProductCarousel } from "@/entities/product";
import { selectUserCurrency } from "@/entities/user/model/selectors/selectUserCurrency/selectUserCurrency";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import { useAppSelector } from "@/shared/lib";
import { AppIcon, Button, CarouselControls } from "@/shared/ui";

import { useGetBestSellingProductsQuery } from "../api/bestSellingProductsApi";

import styles from "./BestSellingProducts.module.scss";

export const BestSellingProducts = () => {
  const { t, i18n } = useTranslation();
  const currency = useAppSelector(selectUserCurrency);
  const { data, isError, isFetching, refetch } = useGetBestSellingProductsQuery(
    { locale: i18n.language, currency }
  );

  const products = data?.products;
  const total = data?.total || 0;

  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(
    undefined
  );
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("products.bestSellers")}</h3>
        <div className={styles.controls}>
          <Button size="sm" theme="outline">
            {t("products.viewAll")}{" "}
            {!isFetching && <>({total < 100 ? total : "99+"})</>}
            <AppIcon Icon={ArrowRightIcon} />
          </Button>
          <CarouselControls emblaApi={emblaApi} />
        </div>
      </div>
      <ProductCarousel
        isLoading={isFetching}
        products={products}
        error={isError}
        onEmblaInit={setEmblaApi}
        onRetry={refetch}
      />
    </section>
  );
};
