import {useEffect, useState} from "react";

import ImagePlaceholderIcon from "@/shared/assets/icons/ImagePlaceholder.svg?react";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Skeleton} from "@/shared/ui/Skeleton";

import styles from "./AppImage.module.scss";

interface AppImageProps {
    src?: string;
    alt?: string;
    fallbackSrc?: string;
    className?: string;
    containerClassName?: string;
    lazy?: boolean;
    draggable?: boolean;
    objectFit?: "contain" | "cover";
    showErrorMessage?: boolean;
}

export const AppImage = (props: AppImageProps) => {
    const {
        src,
        alt,
        fallbackSrc,
        className,
        containerClassName,
        lazy = true,
        draggable = true,
        objectFit = "contain",
        showErrorMessage = true,
    } = props;

    const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [useFallback, setUseFallback] = useState<boolean>(false);

    useEffect(() => {
        setImageError(false);
        setImageLoading(true);
        setUseFallback(false);
    }, [src]);

    const showFallbackOnError = () => {
        if (!useFallback && fallbackSrc) {
            setUseFallback(true);
        } else {
            setImageError(true);
            setImageLoading(false);
        }
    };

    const markImageLoaded = () => {
        setImageLoading(false);
    };

    const currentSrc = useFallback ? fallbackSrc : src;

    if (imageError || !currentSrc) {
        return (
            <div className={cn(styles.placeholder, containerClassName)}>
                <AppIcon Icon={ImagePlaceholderIcon} size={48} className={styles.placeholderIcon} />
                {showErrorMessage && (
                    <span className={styles.placeholderText}>Image unavailable</span>
                )}
            </div>
        );
    }

    return (
        <div className={cn(styles.container, containerClassName)}>
            {imageLoading && (
                <Skeleton
                    className={styles.loadingSkeleton}
                    width="100%"
                    height="100%"
                    borderRadius={16}
                    aria-hidden
                />
            )}
            <img
                className={cn(styles.image, styles[objectFit], className, {
                    [styles.hidden]: imageLoading,
                })}
                src={currentSrc}
                alt={alt}
                loading={lazy ? "lazy" : "eager"}
                draggable={draggable}
                onError={showFallbackOnError}
                onLoad={markImageLoaded}
            />
        </div>
    );
};
