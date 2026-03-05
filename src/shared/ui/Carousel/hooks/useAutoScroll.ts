import type {EmblaCarouselType} from "embla-carousel";
import type {AutoScrollType} from "embla-carousel-auto-scroll";

type AutoScroll = AutoScrollType | undefined;

export const useAutoScroll = (emblaApi: EmblaCarouselType | undefined) => {
    const pauseAutoScroll = () => {
        if (!emblaApi) return;

        const autoScrollPlugin = emblaApi.plugins()?.autoScroll as AutoScroll;
        if (autoScrollPlugin) {
            autoScrollPlugin?.stop();
        }
    };
    const resumeAutoScroll = () => {
        if (!emblaApi) return;

        const autoScrollPlugin = emblaApi.plugins()?.autoScroll as AutoScroll;
        if (autoScrollPlugin) {
            autoScrollPlugin?.play();
        }
    };

    return {
        pauseAutoScroll,
        resumeAutoScroll,
    };
};
