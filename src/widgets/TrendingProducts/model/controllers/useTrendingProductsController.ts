import type {EmblaCarouselType} from "embla-carousel";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

import {ProductCardWithAddToCart} from "@/features/add-to-cart";

import {useGetProducts} from "@/entities/product/api/productApi.ts";
import {selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppSelector} from "@/shared/lib";

import {useGetTrendingProductTagsQuery} from "../../api/trendingProductsApi";

export const useTrendingProductsController = () => {
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
    const total = productsData?.total || 0;

    const changeTag = (tagId: string) => {
        setCurrentTagId(tagId);
    };

    const setCarouselApi = (embla: EmblaCarouselType) => {
        setEmblaApi(embla);
    };

    return createControllerResult({
        data: {
            tags,
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
    });
};
