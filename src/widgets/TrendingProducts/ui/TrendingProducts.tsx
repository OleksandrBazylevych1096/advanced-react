import type {EmblaCarouselType} from "embla-carousel";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

import {TrendingProductsSkeleton} from "@/widgets/TrendingProducts/ui/TrendingProductsSkeleton.tsx";

import {ProductCard, ProductCardSkeleton} from "@/entities/product";
import {useGetProducts} from "@/entities/product/api/productApi.ts";
import {TagList} from "@/entities/tag";
import {selectUserCurrency} from "@/entities/user";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import {useAppSelector} from "@/shared/lib";
import {AppIcon, Button, Carousel, CarouselControls, CarouselSkeleton, EmptyState, ErrorState} from "@/shared/ui";

import {useGetTrendingProductTagsQuery,} from "../api/trendingProductsApi";

import styles from "./TrendingProducts.module.scss";

export const TrendingProducts = () => {
    const {t, i18n} = useTranslation();
    const [currentTagId, setCurrencyTagId] = useState<string>("");
    const currency = useAppSelector(selectUserCurrency);
    const {
        data: tags,
        isError: tagsIsError,
        isFetching: tagsIsFetching,
        isLoading: tagsIsLoading
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
        {skip: !currentTagId}
    );


    const products = productsData?.products;
    const total = productsData?.total || 0;

    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(
        undefined
    );
    const handleEmblaInit = (embla: EmblaCarouselType) => {
        setEmblaApi(embla);
    };

    const handleTagChange = (tagId: string) => {
        setCurrencyTagId(tagId);
    };

    useEffect(() => {
        if (tags && tags.length > 0 && !currentTagId) {
            setCurrencyTagId(tags[0].id);
        }
    }, [currentTagId, tags]);


    if (productsIsLoading || tagsIsLoading) {
        return <TrendingProductsSkeleton/>
    }

    if (tagsIsError || productsIsError) {
        return (
            <ErrorState
                message={t("products.unexpectedError")}
                onRetry={refetch}
            />
        );
    }

    if (!products || products.length === 0) {
        return (
            <EmptyState title={t("products.noProducts")}/>
        );
    }

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>{t("products.trendingProducts")}</h3>
                <div className={styles.controls}>
                    <Button size="sm" theme="outline">
                        {t("products.viewAll")}{" "}
                        {!productsIsFetching && <>({total < 100 ? total : "99+"})</>}
                        <AppIcon Icon={ArrowRightIcon}/>
                    </Button>
                    <CarouselControls emblaApi={emblaApi}/>
                </div>
            </div>
            <div className={styles.tagsContainer}>
                <TagList
                    tags={tags}
                    isLoading={tagsIsFetching}
                    currentTagId={currentTagId}
                    onTagChange={handleTagChange}
                />
            </div>
            {productsIsFetching
                ? <CarouselSkeleton ItemSkeletonComponent={<ProductCardSkeleton/>}/>
                : <Carousel
                    options={{slidesToScroll: "auto"}}
                    onEmblaInit={handleEmblaInit}
                >
                    {products.map((product) => (
                        <ProductCard product={product} key={product.id}/>
                    ))}
                </Carousel>}
        </section>
    );
};
