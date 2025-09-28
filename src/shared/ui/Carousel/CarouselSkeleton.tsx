import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { Fragment, type ReactNode } from "react";

import { Carousel } from "./Carousel";

interface CarouselSkeletonProps {
  ItemSkeletonComponent: ReactNode;
  count?: number;
  options?: EmblaOptionsType;
  className?: string;
  containerClassName?: string;
  slideClassName?: string;
  onEmblaInit?: (embla: EmblaCarouselType) => void;
}

export const CarouselSkeleton = (props: CarouselSkeletonProps) => {
  const {
    ItemSkeletonComponent,
    count = 7,
    options,
    className,
    containerClassName,
    slideClassName,
    onEmblaInit,
  } = props;

  return (
    <Carousel
      options={options}
      className={className}
      containerClassName={containerClassName}
      slideClassName={slideClassName}
      onEmblaInit={onEmblaInit}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Fragment key={index}>{ItemSkeletonComponent}</Fragment>
      ))}
    </Carousel>
  );
};
