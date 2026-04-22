import {useTranslation} from "react-i18next";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import {cn} from "@/shared/lib/styling";
import {Accordion} from "@/shared/ui/Accordion";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Portal} from "@/shared/ui/Portal";
import {ErrorState} from "@/shared/ui/StateViews";

import {CheckboxFilterSection} from "../CheckboxFilterSection/CheckboxFilterSection";
import {RangeFilterSection} from "../RangeFilterSection/RangeFilterSection";

import styles from "./ProductFilters.module.scss";
import {
    useProductFilters,
    type ProductFiltersSpecialType,
} from "./useProductFilters/useProductFilters.ts";

// TODO - add disabled facets items instead of hiding them if filters changes

export type ProductFiltersSections = "countries" | "brands" | "price";

interface ProductFiltersProps {
    defaultOpenFilters?: ProductFiltersSections[];
    categoryId?: string | null;
    tagId?: string | null;
    searchQuery?: string | null;
    special?: ProductFiltersSpecialType;
}

export const ProductFilters = ({
    defaultOpenFilters,
    categoryId,
    tagId,
    searchQuery,
    special,
}: ProductFiltersProps) => {
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
    } = useProductFilters({categoryId, tagId, searchQuery, special});

    const sidebarClassName = cn(styles.sidebar, {[styles.open]: isSidebarOpen});
    const overlayClassName = cn(styles.overlay, {[styles.open]: isSidebarOpen});

    if (hasError && !facets) {
        return (
            <Portal>
                <div className={overlayClassName} aria-hidden={!isSidebarOpen}>
                    <div
                        className={styles.backdrop}
                        onClick={closeSidebar}
                        data-testid="product-filters-backdrop"
                    />
                    <div className={sidebarClassName} data-testid="product-filters-sidebar">
                        <ErrorState
                            message={t("products.unexpectedError")}
                            onRetry={refetch}
                            data-testid="product-filters-error"
                        />
                    </div>
                </div>
            </Portal>
        );
    }

    return (
        <Portal>
            <div className={overlayClassName} aria-hidden={!isSidebarOpen}>
                <div
                    className={styles.backdrop}
                    onClick={closeSidebar}
                    data-testid="product-filters-backdrop"
                />
                <div className={sidebarClassName} data-testid="product-filters-sidebar">
                    <div className={styles.header}>
                        <h4 className={styles.title} data-testid="product-filters-title">
                            {t("productFilters.title")}
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
                            title={t("productFilters.countries")}
                            value="countries"
                            options={facets?.countries}
                            selectedValues={currentCountries}
                            onToggle={toggleCountry}
                            isLoading={isLoading}
                            error={hasError}
                            data-testid="filter-section-countries"
                        />

                        <CheckboxFilterSection
                            title={t("productFilters.brands")}
                            value="brands"
                            options={facets?.brands}
                            selectedValues={currentBrands}
                            onToggle={toggleBrand}
                            isLoading={isLoading}
                            error={hasError}
                            data-testid="filter-section-brands"
                        />

                        <RangeFilterSection
                            title={t("productFilters.price")}
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
                        {t("productFilters.reset")}
                    </Button>
                </div>
            </div>
        </Portal>
    );
};
