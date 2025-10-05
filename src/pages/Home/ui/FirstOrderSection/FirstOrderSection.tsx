import { useTranslation } from "react-i18next";

import { ProductCard } from "@/entities/product";
import { ProductCardSkeleton } from "@/entities/product/ui/ProductCard/ProductCardSkeleton/ProductCardSkeleton";
import { selectUserCurrency } from "@/entities/user/model/selectors/selectUserCurrency/selectUserCurrency";

import ChevronRight from "@/shared/assets/icons/ChevronRight.svg?react";
import { formatCompactNumber, useAppSelector } from "@/shared/lib";
import { AppIcon, Button, Counter } from "@/shared/ui";

import { useGetFirstOrderProductsQuery } from "../../api/homePageApi";

import styles from "./FirstOrderSection.module.scss";

export const FirstOrderSection = () => {
  const { t, i18n } = useTranslation();
  const currency = useAppSelector(selectUserCurrency);

  const {
    data: products,
    isFetching,
    isError,
    refetch,
  } = useGetFirstOrderProductsQuery({ locale: i18n.language, currency });

  const handleRetry = () => {
    refetch();
  };

  const renderProductCards = () => {
    if (isFetching) {
      return (
        <>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </>
      );
    }

    if (isError) {
      return (
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>
            {t("firstOrderSection.errorLoading")}
          </p>
          <Button onClick={handleRetry}>
            {t("firstOrderSection.tryAgain")}
          </Button>
        </div>
      );
    }

    if (!products || products.length === 0) {
      return (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>
            {t("firstOrderSection.noProducts")}
          </p>
        </div>
      );
    }

    return products?.map((product) => (
      <ProductCard product={product} key={product.id} />
    ));
  };

  return (
    <div className={styles.firstOrderSection}>
      <div className={styles.productCards}>{renderProductCards()}</div>
      <div className={styles.info}>
        <div className={styles.offer}>
          {t("firstOrderSection.discountOffer")}
        </div>
        <h3 className={styles.title}>{t("firstOrderSection.orderTitle")}</h3>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <p className={styles.statItemTitle}>
              <Counter formatter={formatCompactNumber} to={1400} />
            </p>
            <p className={styles.statItemDescription}>
              {t("firstOrderSection.items")}
            </p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statItemTitle}>
              <Counter to={20} />
            </p>
            <p className={styles.statItemDescription}>
              {t("firstOrderSection.minutes")}
            </p>
          </div>
          <div className={styles.statItem}>
            <p className={styles.statItemTitle}>
              <Counter formatter={(value) => `${value}%`} to={30} />
            </p>
            <p className={styles.statItemDescription}>
              {t("firstOrderSection.upToOffers")}
            </p>
          </div>
        </div>
        <Button size="lg" className={styles.button}>
          {t("firstOrderSection.orderNow")} <AppIcon Icon={ChevronRight} />
        </Button>
      </div>
    </div>
  );
};
