import type {AutoScrollOptionsType} from "embla-carousel-auto-scroll";

import {AppImage} from "@/shared/ui/AppImage";
import {Carousel, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Skeleton} from "@/shared/ui/Skeleton";

import styles from "./PromoCarousel.module.scss";
import {usePromoCarousel} from "./usePromoCarousel/usePromoCarousel.ts";

interface PromoCarouselProps {
    autoScrollOptions?: AutoScrollOptionsType;
}

export const PromoCarousel = (props: PromoCarouselProps) => {
    const {autoScrollOptions = {}} = props;
    const {
        data: {bannerUrls, dynamicFallbackImg, options, plugins},
        status: {isLoading},
        actions: {setEmblaApi, pauseAutoScroll, resumeAutoScroll},
    } = usePromoCarousel({autoScrollOptions});

    if (isLoading) {
        return (
            <CarouselSkeleton
                ItemSkeletonComponent={<Skeleton width={600} height={240} borderRadius={16} />}
            />
        );
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
