import {useState} from "react";

import ImagePlaceholderIcon from "@/shared/assets/icons/ImagePlaceholder.svg?react";
import {cn} from "@/shared/lib";
import {AppIcon} from "@/shared/ui";

import styles from "./ProductCardImage.module.scss";

interface ProductCardImageProps {
    src: string;
    alt?: string;
    className?: string;
    lazy?: boolean;
}

export const ProductCardImage = (props: ProductCardImageProps) => {
    const {src, alt, className, lazy = true} = props;

    const [imageError, setImageError] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    if (imageError) {
        return (
            <div className={styles.placeholder}>
                <AppIcon
                    Icon={ImagePlaceholderIcon}
                    size={48}
                    className={styles.placeholderIcon}
                />
                <span className={styles.placeholderText}>Image unavailable</span>
            </div>
        );
    }

    return (
        <>
            {imageLoading && (
                <div className={cn(styles.placeholder, styles.loading)}>
                    <div className={styles.shimmer}/>
                </div>
            )}
            <img
                className={cn(styles.image, className, {
                    [styles.hidden]: imageLoading,
                })}
                src={src}
                alt={alt}
                loading={lazy ? "lazy" : "eager"}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </>
    );
};
