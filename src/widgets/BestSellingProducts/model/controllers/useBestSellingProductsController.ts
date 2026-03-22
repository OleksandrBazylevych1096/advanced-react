import type {EmblaCarouselType} from "embla-carousel";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppSelector} from "@/shared/lib/state";

import {useGetBestSellingProductsQuery} from "../../api/bestSellingProductsApi";

export const useBestSellingProductsController = () => {
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();

    const {data, isError, isFetching, isLoading, refetch} = useGetBestSellingProductsQuery({
        locale: i18n.language,
        currency,
    });

    const products = data?.products;
    const total = data?.total || 0;

    const setCarouselApi = (embla: EmblaCarouselType) => {
        setEmblaApi(embla);
    };

    return createControllerResult({
        data: {
            products,
            total,
            currency,
            emblaApi,
        },
        status: {
            isError,
            isFetching,
            isLoading,
        },
        actions: {
            refetch,
            setCarouselApi,
        },
    });
};
