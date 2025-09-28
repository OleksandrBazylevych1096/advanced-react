import type { EmblaCarouselType } from "embla-carousel";
import type { AutoScrollType } from "embla-carousel-auto-scroll";

type AutoScroll = AutoScrollType | undefined;

export const useAutoScroll = (emblaApi: EmblaCarouselType | undefined) => {
  const handleMouseEnter = () => {
    if (!emblaApi) return;

    const autoScrollPlugin = emblaApi.plugins()?.autoScroll as AutoScroll;
    if (autoScrollPlugin) {
      autoScrollPlugin?.stop();
    }
  };
  const handleMouseLeave = () => {
    if (!emblaApi) return;

    const autoScrollPlugin = emblaApi.plugins()?.autoScroll as AutoScroll;
    if (autoScrollPlugin) {
      autoScrollPlugin?.play();
    }
  };

  return {
    handleMouseEnter,
    handleMouseLeave,
  };
};
