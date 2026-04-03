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
import {Stack} from "@/shared/ui/Stack";
import {EmptyState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import styles from "./SearchPage.module.scss";
import {useSearchPage} from "./useSearchPage/useSearchPage.ts";

const SearchPage = () => {
    const {t} = useTranslation();
    const {
        data: {searchQuery, activeCategoryId, isValidSearch, breadcrumbs},
    } = useSearchPage();

    if (!isValidSearch) {
        return (
            <Stack gap={16}>
                <Typography as="h1" variant="heading" weight="semibold">
                    {t("search.page.title")}
                </Typography>
                <EmptyState title={t("search.page.emptyQuery")} />
            </Stack>
        );
    }

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={{productFilters: productFiltersReducer}}>
            <div className={styles.content}>
                <ProductFilters categoryId={activeCategoryId} searchQuery={searchQuery} />
                <div className={styles.wrapper}>
                    <Breadcrumbs className={styles.breadcrumbs} items={breadcrumbs} />
                    <PromoCarousel />
                    <CategoryNavigation searchQuery={searchQuery} />
                    <ProductFiltersControls />
                    <Typography
                        className={styles.title}
                        as="h1"
                        variant="heading"
                        weight="semibold"
                    >
                        {t("search.page.titleWithQuery", {
                            query: searchQuery,
                        })}
                    </Typography>
                    <Catalog searchQuery={searchQuery} categoryId={activeCategoryId} />
                </div>
            </div>
        </DynamicModuleLoader>
    );
};

export default SearchPage;
