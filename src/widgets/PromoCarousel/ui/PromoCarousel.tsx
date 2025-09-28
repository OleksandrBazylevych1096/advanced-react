import { type EmblaCarouselType, type EmblaOptionsType } from "embla-carousel";
import AutoScroll, {
  type AutoScrollOptionsType,
} from "embla-carousel-auto-scroll";
import { useState, type SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";

import { Carousel, CarouselSkeleton, useAutoScroll } from "@/shared/ui";

import styles from "./PromoCarousel.module.scss";

interface PromoCarouselProps {
  bannersUrl: string[];
  autoScrollOptions?: AutoScrollOptionsType;
  fallbackImg?: string;
  isLoading?: boolean;
}

export const PromoCarousel = (props: PromoCarouselProps) => {
  const { t } = useTranslation();
  const {
    bannersUrl,
    isLoading,
    autoScrollOptions = {},
    fallbackImg = `https://placehold.co/600x200?text=${t(
      "carousel.imageError"
    )}`,
  } = props;

  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();
  const { handleMouseEnter, handleMouseLeave } = useAutoScroll(emblaApi);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = fallbackImg;
  };

  const plugins = [
    AutoScroll({ ...autoScrollOptions, playOnInit: true, speed: 1 }),
  ];

  const options: EmblaOptionsType = {
    dragFree: true,
    align: "start",
    loop: true,
  };

  if (isLoading)
    return (
      <CarouselSkeleton
        ItemSkeletonComponent={<div className={styles.skeletonItem} />}
      />
    );

  return (
    <Carousel
      options={options}
      plugins={plugins}
      onEmblaInit={setEmblaApi}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {bannersUrl.map((bannerUrl, index) => (
        <img
          key={index}
          className={styles.slideImg}
          src={bannerUrl}
          onError={handleImageError}
        />
      ))}
    </Carousel>
  );
};
