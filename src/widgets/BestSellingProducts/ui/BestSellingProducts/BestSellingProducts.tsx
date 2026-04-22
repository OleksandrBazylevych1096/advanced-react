import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {ProductCardSkeleton} from "@/entities/product";

import ArrowRightIcon from "@/shared/assets/icons/ArrowRight.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Carousel, CarouselControls, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./BestSellingProducts.module.scss";
import {BestSellingProductsSkeleton} from "./BestSellingProductsSkeleton.tsx";
import {useBestSellingProducts} from "./useBestSellingProducts/useBestSellingProducts.ts";

export const BestSellingProducts = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const {
        data: {products, total, currency, emblaApi, ProductCardWithAddToCart},
        status: {isError, isFetching, isLoading},
        actions: {refetch, setCarouselApi},
    } = useBestSellingProducts();

    const openBestSellersPage = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.BESTSELLERS]));
    };

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
                    <Button size="sm" theme="outline" onClick={openBestSellersPage}>
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
