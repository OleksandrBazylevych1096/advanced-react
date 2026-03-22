import {useTranslation} from "react-i18next";

import {useGetPromoBannersQuery} from "@/widgets/PromoCarousel/api/promoCarouselApi.ts";
import {generatePlaceholder} from "@/widgets/PromoCarousel/lib/generatePlaceholder/generatePlaceholder.ts";

import {PROJECT_ENV} from "@/shared/config";
import {createControllerResult} from "@/shared/lib/state";

export const usePromoCarouselController = () => {
    const {t} = useTranslation();
    const {data: bannerUrls, isLoading} = useGetPromoBannersQuery();
    const dynamicFallbackImg = generatePlaceholder(t("carousel.imageError"));
    const isClientEnv = PROJECT_ENV === "client";

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
