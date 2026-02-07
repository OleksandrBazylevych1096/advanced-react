import {cn} from '@/shared/lib'
import {AppImage, Button} from '@/shared/ui'

import styles from './Carousel.module.scss'

type CarouselThumbnailsProps = {
    slideUrls: string[]
    selectedIndex: number
    onThumbClick: (index: number) => void
    emblaRef: (node: HTMLElement | null) => void
}

export const CarouselThumbnails = ({
                                       slideUrls,
                                       selectedIndex,
                                       onThumbClick,
                                       emblaRef,
                                   }: CarouselThumbnailsProps) => {
    return (
        <div className={styles.thumbs}>
            <div className={styles.thumbsViewport} ref={emblaRef}>
                <div className={styles.thumbsContainer}>
                    {slideUrls.map((slideUrl, index) => (
                        <div
                            key={slideUrl}
                            className={cn(styles.thumbSlide, {
                                [styles.thumbSlideSelected]: index === selectedIndex,
                            })}
                        >
                            <Button
                                theme="ghost"
                                type="button"
                                onClick={() => onThumbClick(index)}
                                className={styles.thumbButton}
                            >
                                <AppImage
                                    src={slideUrl}
                                    alt={`slide ${index + 1}`}
                                    className={styles.thumbImage}
                                    draggable={false}
                                    showErrorMessage={false}

                                />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
