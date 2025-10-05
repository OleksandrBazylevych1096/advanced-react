import type { EmblaCarouselType } from "embla-carousel";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ProductCarousel } from "@/entities/product";
import { TagList } from "@/entities/tag";
import { selectUserCurrency } from "@/entities/user/model/selectors/selectUserCurrency/selectUserCurrency";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import { useAppSelector } from "@/shared/lib";
import { AppIcon, Button, CarouselControls } from "@/shared/ui";

import {
  useGetTrendingProductsByTagQuery,
  useGetTrendingProductTagsQuery,
} from "../api/trendingProductsApi";

import styles from "./TrendingProducts.module.scss";

export const TrendingProducts = () => {
  const { t, i18n } = useTranslation();
  const [currentTagId, setCurrenctTagId] = useState<string>("");
  const currency = useAppSelector(selectUserCurrency);
  const {
    data: tags,
    isError: TagsIsError,
    isFetching: tagsIsFetching,
  } = useGetTrendingProductTagsQuery({ locale: i18n.language });

  const {
    data: productsData,
    isError: productsIsError,
    isFetching: productsIsFetching,
    refetch,
  } = useGetTrendingProductsByTagQuery(
    {
      locale: i18n.language,
      currency,
      tagId: currentTagId,
    },
    { skip: !currentTagId }
  );

  const products = productsData?.products;
  const total = productsData?.total || 0;

  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(
    undefined
  );

  useEffect(() => {
    if (tags && tags.length > 0 && !currentTagId) {
      setCurrenctTagId(tags[0].id);
    }
  }, [currentTagId, tags]);

  const handleTagChange = (tagId: string) => {
    setCurrenctTagId(tagId);
  };
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("products.trendingProducts")}</h3>
        <div className={styles.controls}>
          <Button size="sm" theme="outline">
            {t("products.viewAll")}{" "}
            {!productsIsFetching && <>({total < 100 ? total : "99+"})</>}
            <AppIcon Icon={ArrowRightIcon} />
          </Button>
          <CarouselControls emblaApi={emblaApi} />
        </div>
      </div>
      <div className={styles.tagsContainer}>
        <TagList
          tags={tags}
          isLoading={tagsIsFetching}
          currentTagId={currentTagId}
          onTagChange={handleTagChange}
        />
      </div>
      <ProductCarousel
        isLoading={productsIsFetching}
        products={products}
        error={productsIsError || TagsIsError}
        onEmblaInit={setEmblaApi}
        onRetry={refetch}
      />
    </section>
  );
};
