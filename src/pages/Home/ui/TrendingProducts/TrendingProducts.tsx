import type {EmblaCarouselType} from "embla-carousel";
import {useTranslation} from "react-i18next";

import {ProductCardSkeleton} from "@/entities/product";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Carousel, CarouselControls, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import {TagList} from "../TagList/TagList";

import styles from "./TrendingProducts.module.scss";
import {TrendingProductsSkeleton} from "./TrendingProductsSkeleton";
import {useTrendingProducts} from "./useTrendingProducts/useTrendingProducts.ts";

export const TrendingProducts = () => {
    const {t} = useTranslation();
    const {
        data: {tags, products, total, currentTagId, currency, emblaApi, ProductCardWithAddToCart},
        status: {
            tagsIsError,
            tagsIsFetching,
            tagsIsLoading,
            productsIsError,
            productsIsFetching,
            productsIsLoading,
        },
        actions: {refetch, changeTag, setCarouselApi},
    } = useTrendingProducts();

    if (productsIsLoading || tagsIsLoading) {
        return <TrendingProductsSkeleton />;
    }

    if (tagsIsError || productsIsError) {
        return <ErrorState message={t("products.unexpectedError")} onRetry={refetch} />;
    }

    if (!products || products.length === 0) {
        return <EmptyState title={t("products.noProducts")} />;
    }

    return (
        <section className={styles.section}>
            <Stack className={styles.header} direction="row" align="center" justify="space-between">
                <Typography as="h3" variant="display" weight="bold">
                    {t("products.trendingProducts")}
                </Typography>
                <Stack direction="row" gap={16} align="center">
                    <Button size="sm" theme="outline">
                        {t("products.viewAll")}{" "}
                        {!productsIsFetching && <>({total < 100 ? total : "99+"})</>}
                        <AppIcon Icon={ArrowRightIcon} />
                    </Button>
                    <CarouselControls emblaApi={emblaApi} />
                </Stack>
            </Stack>
            <div className={styles.tagsContainer}>
                <TagList
                    tags={tags}
                    isLoading={tagsIsFetching}
                    currentTagId={currentTagId}
                    onTagChange={changeTag}
                />
            </div>
            {productsIsFetching ? (
                <CarouselSkeleton ItemSkeletonComponent={<ProductCardSkeleton />} />
            ) : (
                <Carousel
                    options={{slidesToScroll: "auto"}}
                    onEmblaInit={setCarouselApi as (embla: EmblaCarouselType) => void}
                >
                    {products.map((product) => (
                        <ProductCardWithAddToCart
                            product={product}
                            currency={currency}
                            key={product.id}
                        />
                    ))}
                </Carousel>
            )}
        </section>
    );
};
