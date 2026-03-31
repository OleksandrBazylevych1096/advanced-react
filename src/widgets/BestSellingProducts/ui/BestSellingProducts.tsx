import type {EmblaCarouselType} from "embla-carousel";
import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useGetBestSellingProductsQuery} from "@/widgets/BestSellingProducts/api/bestSellingProductsApi";
import {BestSellingProductsSkeleton} from "@/widgets/BestSellingProducts/ui/BestSellingProductsSkeleton.tsx";

import {ProductCardWithAddToCart} from "@/features/cart/add";

import {ProductCardSkeleton} from "@/entities/product";
import {selectUserCurrency} from "@/entities/user";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import {useAppSelector} from "@/shared/lib/state";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Carousel, CarouselControls, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./BestSellingProducts.module.scss";

export const BestSellingProducts = () => {
    const {t} = useTranslation();
    const {i18n} = useTranslation();
    const currency = useAppSelector(selectUserCurrency);
    const [emblaApi, setCarouselApi] = useState<EmblaCarouselType | undefined>();
    const {data, isError, isFetching, isLoading, refetch} = useGetBestSellingProductsQuery({
        locale: i18n.language,
        currency,
    });
    const products = data?.products;
    const total = data?.total || 0;

    if (isLoading) {
        return <BestSellingProductsSkeleton />;
    }

    if (isError) {
        return (
            <Stack className={styles.errorContainer} gap={16} align="center" justify="center">
                <Typography className={styles.errorText} variant="heading" weight="semibold">
                    {t("products.unexpectedError")}
                </Typography>
                <Button onClick={refetch}>{t("products.tryAgain")}</Button>
            </Stack>
        );
    }

    if (!products || products.length === 0) {
        return (
            <Stack className={styles.emptyContainer} align="center" justify="center">
                <Typography variant="heading" weight="semibold">
                    {t("products.noProducts")}
                </Typography>
            </Stack>
        );
    }
    return (
        <section className={styles.section}>
            <Stack className={styles.header} direction="row" align="center" justify="space-between">
                <Typography as="h3" variant="display" weight="bold">
                    {t("products.bestSellers")}
                </Typography>
                <Stack direction="row" gap={16} align="center">
                    <Button size="sm" theme="outline">
                        {t("products.viewAll")}{" "}
                        {!isFetching && <>({total < 100 ? total : "99+"})</>}
                        <AppIcon Icon={ArrowRightIcon} />
                    </Button>
                    <CarouselControls emblaApi={emblaApi} />
                </Stack>
            </Stack>
            {isFetching ? (
                <CarouselSkeleton count={20} ItemSkeletonComponent={<ProductCardSkeleton />} />
            ) : (
                <Carousel options={{slidesToScroll: "auto"}} onEmblaInit={setCarouselApi}>
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
