import {type EmblaCarouselType, type EmblaOptionsType} from "embla-carousel";
import AutoScroll, {type AutoScrollOptionsType,} from "embla-carousel-auto-scroll";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useGetPromoBannersQuery} from "@/widgets/PromoCarousel/api/promoCarouselApi.ts";
import {generatePlaceholder} from "@/widgets/PromoCarousel/lib/generatePlaceholder/generatePlaceholder.ts";
import {PromoSlide} from "@/widgets/PromoCarousel/ui/PromoSlide.tsx";

import {Carousel, CarouselSkeleton, useAutoScroll} from "@/shared/ui";

import styles from './PromoCarousel.module.scss'

interface PromoCarouselProps {
    autoScrollOptions?: AutoScrollOptionsType;
}

export const PromoCarousel = (props: PromoCarouselProps) => {
    const {t} = useTranslation();
    const {data: bannerUrls, isLoading} = useGetPromoBannersQuery()
    const dynamicFallbackImg = generatePlaceholder(t("carousel.imageError"))
    const isClientEnv = import.meta.env.VITE_PROJECT_ENV === 'client'

    const {
        autoScrollOptions = {},
    } = props;

    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();
    const {handleMouseEnter, handleMouseLeave} = useAutoScroll(emblaApi);

    const plugins = [
        AutoScroll({...autoScrollOptions, playOnInit: isClientEnv, speed: 1}),
    ];

    const options: EmblaOptionsType = {
        dragFree: true,
        align: "start",
        loop: true,
    };

    if (isLoading) {
        return <CarouselSkeleton ItemSkeletonComponent={<div className={styles.skeletonItem}/>}/>
    }

    if (!bannerUrls || bannerUrls.length === 0) {
        return null
    }


    return (
        <Carousel
            options={options}
            plugins={plugins}
            onEmblaInit={setEmblaApi}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {bannerUrls.map((bannerUrl, index) => (
                <PromoSlide key={index} src={bannerUrl} fallbackSrc={dynamicFallbackImg}/>
            ))}
        </Carousel>
    );
};