import {type EmblaCarouselType, type EmblaOptionsType} from "embla-carousel";
import AutoScroll, {type AutoScrollOptionsType} from "embla-carousel-auto-scroll";
import {useState} from "react";

import {AppImage, Carousel, CarouselSkeleton, useAutoScroll} from "@/shared/ui";

import styles from "./PromoCarousel.module.scss";
import {usePromoCarouselController} from "../model/controllers/usePromoCarouselController";

interface PromoCarouselProps {
    autoScrollOptions?: AutoScrollOptionsType;
}

export const PromoCarousel = (props: PromoCarouselProps) => {
    const {
        data: {bannerUrls, dynamicFallbackImg, isClientEnv},
        status: {isLoading},
    } = usePromoCarouselController();

    const {autoScrollOptions = {}} = props;

    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();
    const {pauseAutoScroll, resumeAutoScroll} = useAutoScroll(emblaApi);

    const plugins = [AutoScroll({...autoScrollOptions, playOnInit: isClientEnv, speed: 1})];

    const options: EmblaOptionsType = {
        dragFree: true,
        align: "start",
        loop: true,
    };

    if (isLoading) {
        return <CarouselSkeleton ItemSkeletonComponent={<div className={styles.skeletonItem} />} />;
    }

    if (!bannerUrls || bannerUrls.length === 0) {
        return null;
    }

    return (
        <Carousel
            options={options}
            plugins={plugins}
            onEmblaInit={setEmblaApi}
            onMouseEnter={pauseAutoScroll}
            onMouseLeave={resumeAutoScroll}
        >
            {bannerUrls.map((bannerUrl) => (
                <div className={styles.slideWrapper} key={bannerUrl}>
                    <AppImage
                        src={bannerUrl}
                        fallbackSrc={dynamicFallbackImg}
                        alt="Promo"
                        objectFit="cover"
                        className={styles.slideImg}
                        containerClassName={styles.slideImgContainer}
                        showErrorMessage={false}
                    />
                </div>
            ))}
        </Carousel>
    );
};
