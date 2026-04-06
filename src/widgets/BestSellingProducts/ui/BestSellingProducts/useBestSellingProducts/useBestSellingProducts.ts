import type {EmblaCarouselType} from "embla-carousel";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useGetBestSellingProductsQuery} from "@/widgets/BestSellingProducts/api/bestSellingProductsApi";

import {ProductCardWithAddToCart} from "@/features/add-to-cart";

import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";

export const useBestSellingProducts = () => {
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const [emblaApi, setCarouselApi] = useState<EmblaCarouselType | undefined>();

    const {data, isError, isFetching, isLoading, refetch} = useGetBestSellingProductsQuery({
        locale: i18n.language,
        currency,
    });

    const products = data?.products;
    const total = data?.pagination.total || 0;

    return {
        data: {
            products,
            total,
            currency,
            emblaApi,
            ProductCardWithAddToCart,
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
    };
};
