import {useEffect, useState} from "react";

import {cn} from "@/shared/lib";

import styles from "./PromoCarousel.module.scss";

interface PromoSlideProps {
    src: string
    fallbackSrc: string
}

export const PromoSlide = (props: PromoSlideProps) => {
    const {src, fallbackSrc} = props
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHasError(false);
        setIsLoading(true);
    }, [src]);

    return (
        <div className={styles.slideWrapper}>
            {isLoading && (
                <div className={styles.slideImgSkeleton}/>
            )}
            <img
                className={cn(styles.slideImg, {[styles.hidden]: isLoading})}
                src={hasError ? fallbackSrc : src}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                alt="Promo"
            />
        </div>
    );
};