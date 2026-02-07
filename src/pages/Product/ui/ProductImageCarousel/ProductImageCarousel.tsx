import useEmblaCarousel from 'embla-carousel-react'

import {ProductImageCarouselSkeleton} from "@/pages/Product/ui/ProductImageCarousel/ProductImageCarouselSkeleton.tsx";

import type {ProductImage} from "@/entities/product/model/types/Product.ts";

import {AppImage, EmptyState, ErrorState} from "@/shared/ui";
import {CarouselThumbnails} from "@/shared/ui/Carousel/CarouselThumbnails.tsx";
import {useCarouselThumbnails} from "@/shared/ui/Carousel/hooks/useThumbnails.ts";

import styles from './ProductImageCarousel.module.scss'

type ProductImageCarouselProps = {
    images?: ProductImage[]
    isLoading?: boolean
    error?: boolean
}

export const ProductImageCarousel = ({images, isLoading, error}: ProductImageCarouselProps) => {

    const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
    })

    const {selectedIndex, onThumbClick} = useCarouselThumbnails(
        emblaMainApi,
        emblaThumbsApi,
    )

    if (isLoading) return <ProductImageCarouselSkeleton/>


    if (error) return <ErrorState/>


    if (!images?.length) return <EmptyState title={'No images'}/>

    const slideUrls = images.map((img) => img.url)


    return (
        <div className={styles.wrapper}>
            <div className={styles.mainCarousel}>
                <div className={styles.mainViewport} ref={emblaMainRef}>
                    <div className={styles.mainContainer}>
                        {images.map((image) => (
                            <div key={image.url} className={styles.mainSlide}>
                                <AppImage
                                    src={image.url}
                                    alt={image.alt}
                                    className={styles.mainImage}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CarouselThumbnails
                slideUrls={slideUrls}
                selectedIndex={selectedIndex}
                onThumbClick={onThumbClick}
                emblaRef={emblaThumbsRef}
            />
        </div>
    )
}