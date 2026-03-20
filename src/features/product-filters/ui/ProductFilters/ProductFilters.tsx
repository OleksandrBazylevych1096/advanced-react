import {useTranslation} from "react-i18next";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import {cn} from "@/shared/lib";
import {AppIcon, Button, ErrorState} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";

import {useProductFiltersController} from "../../model/controllers/useProductFiltersController/useProductFiltersController";

import {CheckboxFilterSection} from "./CheckboxFilterSection/CheckboxFilterSection";
import styles from "./ProductFilters.module.scss";
import {RangeFilterSection} from "./RangeFilterSection/RangeFilterSection";

export type ProductFiltersSections = "countries" | "brands" | "price";

interface ProductFiltersProps {
    defaultOpenFilters?: ProductFiltersSections[];
    categoryId?: string;
}

export const ProductFilters = ({defaultOpenFilters, categoryId}: ProductFiltersProps) => {
    const {t} = useTranslation();
    const {
        data: {
            facets,
            currentCountries,
            currentBrands,
            localPriceRange,
            currency,
            isSidebarOpen,
            locale,
        },
        derived: {hasActiveFilters},
        status: {isLoading, hasError},
        actions: {
            toggleCountry,
            toggleBrand,
            changePriceRange,
            resetFilters,
            closeSidebar,
            refetch,
        },
    } = useProductFiltersController({categoryId});

    if (hasError && !facets) {
        return (
            <div
                className={cn(styles.sidebar, {[styles.open]: isSidebarOpen})}
                data-testid="product-filters-sidebar"
            >
                <ErrorState
                    message={t("products.unexpectedError")}
                    onRetry={refetch}
                    data-testid="product-filters-error"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(styles.sidebar, {[styles.open]: isSidebarOpen})}
            data-testid="product-filters-sidebar"
        >
            <div className={styles.header}>
                <h4 className={styles.title} data-testid="product-filters-title">
                    {t("productFilters.title", "Filters")}
                </h4>
                <Button
                    onClick={closeSidebar}
                    theme={"ghost"}
                    data-testid="product-filters-close-btn"
                >
                    <AppIcon className={styles.closeIcon} Icon={CloseIcon} />
                </Button>
            </div>
            <Accordion defaultValue={defaultOpenFilters}>
                <CheckboxFilterSection
                    title={t("productFilters.countries", "Countries")}
                    value="countries"
                    options={facets?.countries}
                    selectedValues={currentCountries}
                    onToggle={toggleCountry}
                    isLoading={isLoading}
                    error={hasError}
                    data-testid="filter-section-countries"
                />

                <CheckboxFilterSection
                    title={t("productFilters.brands", "Brands")}
                    value="brands"
                    options={facets?.brands}
                    selectedValues={currentBrands}
                    onToggle={toggleBrand}
                    isLoading={isLoading}
                    error={hasError}
                    data-testid="filter-section-brands"
                />

                <RangeFilterSection
                    title={t("productFilters.price", "Price")}
                    value="price"
                    rangeValue={localPriceRange}
                    availableRange={facets?.priceRange}
                    onChange={changePriceRange}
                    isLoading={isLoading}
                    error={hasError}
                    inputType="currency"
                    currency={currency}
                    locale={locale}
                    step={1}
                    minRange={5}
                    decimalPlaces={0}
                    data-testid="filter-section-price"
                />
            </Accordion>
            <Button
                disabled={!hasActiveFilters}
                fullWidth
                theme={"outline"}
                onClick={resetFilters}
                data-testid="product-filters-reset-btn"
            >
                {t("productFilters.reset", "Reset")}
            </Button>
        </div>
    );
};
