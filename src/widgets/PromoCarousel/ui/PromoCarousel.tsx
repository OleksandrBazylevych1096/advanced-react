import {type EmblaCarouselType, type EmblaOptionsType} from "embla-carousel";
import AutoScroll, {type AutoScrollOptionsType} from "embla-carousel-auto-scroll";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useGetPromoBannersQuery} from "@/widgets/PromoCarousel/api/promoCarouselApi.ts";
import {generatePlaceholder} from "@/widgets/PromoCarousel/lib/generatePlaceholder/generatePlaceholder.ts";

import {PROJECT_ENV} from "@/shared/config";
import {AppImage} from "@/shared/ui/AppImage";
import {Carousel, CarouselSkeleton, useAutoScroll} from "@/shared/ui/Carousel";
import {Skeleton} from "@/shared/ui/Skeleton";

import styles from "./PromoCarousel.module.scss";

interface PromoCarouselProps {
    autoScrollOptions?: AutoScrollOptionsType;
}

export const PromoCarousel = (props: PromoCarouselProps) => {
    const {t} = useTranslation();
    const {autoScrollOptions = {}} = props;
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
