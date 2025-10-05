import { PromoCarousel } from "@/widgets/PromoCarousel";

import { useGetPromoBannersQuery } from "../../api/homePageApi";

import styles from "./PromoBanners.module.scss";

export const PromoBanners = () => {
  const { data, isFetching, error } = useGetPromoBannersQuery();

  if (error) {
    return null;
  }

  const banners = data || [];

  const middle = Math.ceil(banners.length / 2);
  const firstPart = banners.slice(0, middle);
  const secondPart = banners.slice(middle);

  return (
    <div className={styles.promo}>
      <PromoCarousel isLoading={isFetching} bannersUrl={firstPart} />
      <PromoCarousel
        autoScrollOptions={{ direction: "backward" }}
        isLoading={isFetching}
        bannersUrl={secondPart}
      />
    </div>
  );
};
