import {useTranslation} from "react-i18next";

import {ProductCardWithAddToCart} from "@/features/add-to-cart";

import {ProductCardSkeleton} from "@/entities/product";

import ChevronRight from "@/shared/assets/icons/ChevronRight.svg?react";
import {formatCompactNumber} from "@/shared/lib/formatting";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Counter} from "@/shared/ui/Counter";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./FirstOrderSection.module.scss";
import {useFirstOrderSection} from "./useFirstOrderSection";

export const FirstOrderSection = () => {
    const {t} = useTranslation();
    const {
        data: {products, currency},
        status: {isFetching, isError},
        actions: {retry},
    } = useFirstOrderSection();

    const renderProductCards = () => {
        if (isFetching) {
            return (
                <>
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </>
            );
        }

        if (isError) {
            return (
                <Stack className={styles.errorContainer} gap={16} align="center" justify="center">
                    <Typography className={styles.errorText} variant="heading" weight="semibold">
                        {t("firstOrderSection.errorLoading")}
                    </Typography>
                    <Button onClick={retry}>{t("firstOrderSection.tryAgain")}</Button>
                </Stack>
            );
        }

        if (!products || products.length === 0) {
            return (
                <Stack className={styles.emptyContainer} align="center" justify="center">
                    <Typography className={styles.emptyText} variant="heading" weight="semibold">
                        {t("firstOrderSection.noProducts")}
                    </Typography>
                </Stack>
            );
        }

        return products?.map((product) => (
            <ProductCardWithAddToCart product={product} currency={currency} key={product.id} />
        ));
    };

    return (
        <Stack className={styles.firstOrderSection} direction="row" gap={64}>
            <Stack direction="row" gap={24}>
                {renderProductCards()}
            </Stack>
            <div className={styles.info}>
                <Typography
                    className={styles.offer}
                    variant="bodySm"
                    tone="primary"
                    weight="semibold"
                >
                    {t("firstOrderSection.discountOffer")}
                </Typography>
                <Typography as="h3" className={styles.title} variant="display" weight="semibold">
                    {t("firstOrderSection.orderTitle")}
                </Typography>
                <Stack className={styles.stats} direction="row" gap={32}>
                    <Stack className={styles.statItem}>
                        <Typography
                            className={styles.statItemTitle}
                            variant="heading"
                            weight="semibold"
                        >
                            <Counter formatter={formatCompactNumber} to={1400} />
                        </Typography>
                        <Typography variant="body">{t("firstOrderSection.items")}</Typography>
                    </Stack>
                    <Stack className={styles.statItem}>
                        <Typography
                            className={styles.statItemTitle}
                            variant="heading"
                            weight="semibold"
                        >
                            <Counter to={20} />
                        </Typography>
                        <Typography variant="body">{t("firstOrderSection.minutes")}</Typography>
                    </Stack>
                    <Stack className={styles.statItem}>
                        <Typography
                            className={styles.statItemTitle}
                            variant="heading"
                            weight="semibold"
                        >
                            <Counter formatter={(value) => `${value}%`} to={30} />
                        </Typography>
                        <Typography variant="body">{t("firstOrderSection.upToOffers")}</Typography>
                    </Stack>
                </Stack>
                <Button size="lg" className={styles.button}>
                    {t("firstOrderSection.orderNow")} <AppIcon Icon={ChevronRight} />
                </Button>
            </div>
        </Stack>
    );
};
