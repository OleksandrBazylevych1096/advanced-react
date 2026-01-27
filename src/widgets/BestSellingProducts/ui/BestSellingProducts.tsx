import type {EmblaCarouselType} from "embla-carousel";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {BestSellingProductsSkeleton} from "@/widgets/BestSellingProducts/ui/BestSellingProductsSkeleton.tsx";

import {ProductCard, ProductCardSkeleton} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import {useAppSelector} from "@/shared/lib";
import {AppIcon, Button, Carousel, CarouselControls, CarouselSkeleton} from "@/shared/ui";

import {useGetBestSellingProductsQuery} from "../api/bestSellingProductsApi";

import styles from "./BestSellingProducts.module.scss";

export const BestSellingProducts = () => {
    const {t, i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(
        undefined
    );

    const {data, isError, isFetching, isLoading, refetch} = useGetBestSellingProductsQuery(
        {locale: i18n.language, currency}
    );

    const products = data?.products;
    const total = data?.total || 0;

    const handleEmblaInit = (embla: EmblaCarouselType) => {
        setEmblaApi(embla);
    };


    if (isLoading) {
        return <BestSellingProductsSkeleton/>
    }

    if (isError) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorText}>{t("products.unexpectedError")}</p>
                <Button onClick={refetch}>{t("products.tryAgain")}</Button>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <p className={styles.emptyText}>{t("products.noProducts")}</p>
            </div>
        );
    }
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h3 className={styles.title}>{t("products.bestSellers")}</h3>
                <div className={styles.controls}>
                    <Button size="sm" theme="outline">
                        {t("products.viewAll")}{" "}
                        {!isFetching && <>({total < 100 ? total : "99+"})</>}
                        <AppIcon Icon={ArrowRightIcon}/>
                    </Button>
                    <CarouselControls emblaApi={emblaApi}/>
                </div>
            </div>
            {isFetching
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
