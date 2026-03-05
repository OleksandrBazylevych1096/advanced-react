import {useTranslation} from "react-i18next";

import {useGetPromoBannersQuery} from "@/widgets/PromoCarousel/api/promoCarouselApi.ts";
import {generatePlaceholder} from "@/widgets/PromoCarousel/lib/generatePlaceholder/generatePlaceholder.ts";

import {createControllerResult} from "@/shared/lib";

export const usePromoCarouselController = () => {
    const {t} = useTranslation();
    const {data: bannerUrls, isLoading} = useGetPromoBannersQuery();
    const dynamicFallbackImg = generatePlaceholder(t("carousel.imageError"));
    const isClientEnv = import.meta.env.VITE_PROJECT_ENV === "client";

    return createControllerResult({
        data: {
            bannerUrls,
            dynamicFallbackImg,
            isClientEnv,
        },
        status: {
            isLoading,
        },
    });
};
