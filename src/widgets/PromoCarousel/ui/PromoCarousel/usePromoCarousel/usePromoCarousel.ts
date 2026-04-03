import {type EmblaCarouselType, type EmblaOptionsType} from "embla-carousel";
import AutoScroll, {type AutoScrollOptionsType} from "embla-carousel-auto-scroll";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useGetPromoBannersQuery} from "@/widgets/PromoCarousel/api/promoCarouselApi.ts";
import {generatePlaceholder} from "@/widgets/PromoCarousel/lib/generatePlaceholder/generatePlaceholder.ts";

import {PROJECT_ENV} from "@/shared/config";
import {useAutoScroll} from "@/shared/ui/Carousel";

interface UsePromoCarouselParams {
    autoScrollOptions?: AutoScrollOptionsType;
}

export const usePromoCarousel = ({autoScrollOptions = {}}: UsePromoCarouselParams) => {
    const {t} = useTranslation();
    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();

    const {data: bannerUrls, isLoading} = useGetPromoBannersQuery();
    const {pauseAutoScroll, resumeAutoScroll} = useAutoScroll(emblaApi);

    const dynamicFallbackImg = generatePlaceholder(t("carousel.imageError"));
    const plugins = [
        AutoScroll({...autoScrollOptions, playOnInit: PROJECT_ENV === "client", speed: 1}),
    ];

    const options: EmblaOptionsType = {
        dragFree: true,
        align: "start",
        loop: true,
    };

    return {
        data: {
            bannerUrls,
            dynamicFallbackImg,
            options,
            plugins,
        },
        status: {
            isLoading,
        },
        actions: {
            setEmblaApi,
            pauseAutoScroll,
            resumeAutoScroll,
        },
    };
};
