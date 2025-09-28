import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { Children, useEffect, type ReactNode } from "react";

import { cn } from "@/shared/lib";

import styles from "./Carousel.module.scss";

interface CarouselProps {
  children: ReactNode;
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  className?: string;
  containerClassName?: string;
  slideClassName?: string;
  onEmblaInit?: (embla: EmblaCarouselType) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Carousel = (props: CarouselProps) => {
  const {
    children,
    options,
    plugins,
    className,
    containerClassName,
    slideClassName,
    onEmblaInit,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);

  useEffect(() => {
    if (emblaApi && onEmblaInit) {
      onEmblaInit(emblaApi);
    }
  }, [emblaApi, onEmblaInit]);

  return (
    <div className={cn(styles.carousel, className)}>
      <div className={styles.carouselViewport} ref={emblaRef}>
        <div
          className={cn(styles.carouselContainer, containerClassName)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className={cn(styles.carouselSlide, slideClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
