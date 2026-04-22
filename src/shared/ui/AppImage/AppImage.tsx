import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

    const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(true);
    const [useFallback, setUseFallback] = useState<boolean>(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        setImageError(false);
        setImageLoading(true);
        setUseFallback(false);
    }, [src]);

    const currentSrc = useFallback ? fallbackSrc : src;

    useEffect(() => {
        const image = imageRef.current;

        if (!image || !currentSrc) {
            return;
        }

        // Virtualized lists remount image nodes frequently; cached images can be complete
        // before a new load event reaches React, so we need to reconcile that state manually.
        if (image.complete) {
            if (image.naturalWidth > 0) {
                setImageLoading(false);
                setImageError(false);
                return;
            }

            if (!useFallback && fallbackSrc) {
                setUseFallback(true);
            } else {
                setImageError(true);
                setImageLoading(false);
            }
        }
    }, [currentSrc, fallbackSrc, useFallback]);

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

    if (imageError || !currentSrc) {
        return (
            <div className={cn(styles.placeholder, containerClassName)}>
                <AppIcon Icon={ImagePlaceholderIcon} size={48} className={styles.placeholderIcon} />
                {showErrorMessage && (
                    <span className={styles.placeholderText}>{t("common.imageUnavailable")}</span>
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
                ref={imageRef}
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
