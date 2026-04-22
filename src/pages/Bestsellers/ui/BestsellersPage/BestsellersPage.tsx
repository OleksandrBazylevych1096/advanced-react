import {useTranslation} from "react-i18next";

import {Catalog} from "@/widgets/Catalog";
import {CategoryNavigation} from "@/widgets/CategoryNavigation";
import {PromoCarousel} from "@/widgets/PromoCarousel";

import {
    ProductFilters,
    ProductFiltersControls,
    productFiltersReducer,
} from "@/features/product-filters";

import {DynamicModuleLoader} from "@/shared/lib/state";
import {Breadcrumbs} from "@/shared/ui/Breadcrumbs";
import {Typography} from "@/shared/ui/Typography";

import styles from "./BestsellersPage.module.scss";

const BestsellersPage = () => {
    const {t} = useTranslation();

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productFilters: productFiltersReducer}}>
            <div className={styles.content}>
                <ProductFilters special="bestseller" />
                <div className={styles.wrapper}>
                    <Breadcrumbs
                        className={styles.breadcrumbs}
                        items={[{label: t("products.bestSellers")}]}
                    />
                    <PromoCarousel />
                    <CategoryNavigation />
                    <ProductFiltersControls />
                    <Typography
                        className={styles.title}
                        as="h1"
                        variant="heading"
                        weight="semibold"
                    >
                        {t("products.bestSellers")}
                    </Typography>
                    <Catalog special="bestseller" />
                </div>
            </div>
        </DynamicModuleLoader>
    );
};

export default BestsellersPage;
