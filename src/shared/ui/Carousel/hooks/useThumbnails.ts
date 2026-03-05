import type {EmblaCarouselType} from "embla-carousel";
import {useCallback, useEffect, useState} from "react";

export const useCarouselThumbnails = (
    mainApi: EmblaCarouselType | undefined,
    thumbsApi: EmblaCarouselType | undefined,
) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onThumbClick = useCallback(
        (index: number) => {
            if (!mainApi) return;
            mainApi.scrollTo(index);
        },
        [mainApi],
    );

    const onSelect = useCallback(() => {
        if (!mainApi || !thumbsApi) return;

        const index = mainApi.selectedScrollSnap();
        setSelectedIndex(index);
        thumbsApi.scrollTo(index);
    }, [mainApi, thumbsApi]);

    useEffect(() => {
        if (!mainApi) return;

        onSelect();
        mainApi.on("select", onSelect).on("reInit", onSelect);
    }, [mainApi, onSelect]);

    return {
        selectedIndex,
        onThumbClick,
    };
};
