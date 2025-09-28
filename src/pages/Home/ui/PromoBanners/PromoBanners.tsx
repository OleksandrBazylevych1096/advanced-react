import { PromoCarousel } from "@/widgets/PromoCarousel";

import { useGetPromoBannersQuery } from "../../api/homePageApi";

import styles from "./PromoBanners.module.scss";

export const PromoBanners = () => {
  const { data: banners, isFetching, error } = useGetPromoBannersQuery();

  if (!banners || error) {
    return null;
  }

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
