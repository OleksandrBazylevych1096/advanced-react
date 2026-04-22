import type {EmblaCarouselType} from "embla-carousel";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

import {ProductCardWithAddToCart} from "@/features/add-to-cart";

import {useGetProducts} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import {useAppSelector} from "@/shared/lib/state";

import {useGetTrendingProductTagsQuery} from "../../../api/trendingProductsApi/trendingProductsApi.ts";

export const useTrendingProducts = () => {
    const {i18n} = useTranslation();
    const [currentTagId, setCurrentTagId] = useState<string>("");
    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(undefined);
    const currency = useAppSelector(selectUserCurrency);

    const {
        data: tags,
        isError: tagsIsError,
        isFetching: tagsIsFetching,
        isLoading: tagsIsLoading,
    } = useGetTrendingProductTagsQuery({locale: i18n.language});

    const {
        data: productsData,
        isError: productsIsError,
        isFetching: productsIsFetching,
        isLoading: productsIsLoading,
        refetch,
    } = useGetProducts(
        {
            locale: i18n.language,
            currency,
            tagId: currentTagId,
        },
        {skip: !currentTagId},
    );

    useEffect(() => {
        if (tags && tags.length > 0 && !currentTagId) {
            setCurrentTagId(tags[0].id);
        }
    }, [currentTagId, tags]);

    const products = productsData?.products;
    const total = productsData?.pagination.total || 0;
    const currentTag = tags?.find((tag) => tag.id === currentTagId);

    const changeTag = (tagId: string) => {
        setCurrentTagId(tagId);
    };

    const setCarouselApi = (embla: EmblaCarouselType) => {
        setEmblaApi(embla);
    };

    return {
        data: {
            tags,
            currentTag,
            products,
            total,
            currentTagId,
            currency,
            emblaApi,
            ProductCardWithAddToCart,
        },
        status: {
            tagsIsError,
            tagsIsFetching,
            tagsIsLoading,
            productsIsError,
            productsIsFetching,
            productsIsLoading,
        },
        actions: {
            refetch,
            changeTag,
            setCarouselApi,
        },
    };
};
