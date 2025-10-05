import { useTranslation } from "react-i18next";

import { Button, Carousel, CarouselSkeleton } from "@/shared/ui";

import { useGetTopLevelCategoriesQuery } from "../api/categoryNavigationApi";

import styles from "./CategoryNavigation.module.scss";
import { CategoryNavigationItem } from "./CategoryNavigationItem";

export const CategoryNavigation = () => {
  const { i18n, t } = useTranslation();
  const {
    data: categories,
    isFetching,
    isError,
    refetch,
  } = useGetTopLevelCategoriesQuery({ locale: i18n.language });

  const handleRetry = () => {
    refetch();
  };

  if (isFetching) {
    return (
      <CarouselSkeleton
        count={15}
        ItemSkeletonComponent={<div className={styles.categorySkeleton} />}
      />
    );
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{t("products.loadCategoriesError")}</p>
        <Button onClick={handleRetry}>{t("products.tryAgain")}</Button>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Carousel>
      {categories?.map((category) => (
        <CategoryNavigationItem
          title={category.name}
          slug={category.slug}
          icon={category.icon}
        />
      ))}
    </Carousel>
  );
};
