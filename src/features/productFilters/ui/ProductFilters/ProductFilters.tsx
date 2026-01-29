import {useTranslation} from 'react-i18next';

import {useProductFilters} from "@/features/productFilters/model/services/useProductFilters.ts";
import {
    CheckboxFilterSection
} from "@/features/productFilters/ui/ProductFilters/CheckboxFilterSection/CheckboxFilterSection.tsx";
import {
    RangeFilterSection
} from "@/features/productFilters/ui/ProductFilters/RangeFilterSection/RangeFilterSection.tsx";

import CloseIcon from '@/shared/assets/icons/Close.svg?react'
import {cn} from "@/shared/lib";
import {AppIcon, Button, ErrorState} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";


import styles from './ProductFilters.module.scss';

export type ProductFiltersSections = "countries" | 'brands' | 'price'

interface ProductFiltersProps {
    defaultOpenFilters?: ProductFiltersSections[]
}

export const ProductFilters = ({defaultOpenFilters}: ProductFiltersProps) => {
    const {t} = useTranslation();
    const {
        facets,
        currentCountries,
        currentBrands,
        localPriceRange,
        currency,
        isSidebarOpen,
        locale,
        isLoading,
        hasError,
        hasActiveFilters,
        handleCountryChange,
        handleBrandChange,
        handlePriceRangeChange,
        handleReset,
        handleSidebarClose,
        refetch
    } = useProductFilters();


    if (hasError && !facets) {
        return (
            <div className={cn(styles.sidebar, {[styles.open]: isSidebarOpen})} data-testid="product-filters-sidebar">
                <ErrorState
                    message={t('products.unexpectedError')}
                    onRetry={refetch}
                    data-testid="product-filters-error"
                />
            </div>
        );
    }

    return (
        <div className={cn(styles.sidebar, {[styles.open]: isSidebarOpen})} data-testid="product-filters-sidebar">
            <div className={styles.header}>
                <h4 className={styles.title} data-testid="product-filters-title">{t('productFilters.title', 'Filters')}</h4>
                <Button onClick={handleSidebarClose} theme={'ghost'} data-testid="product-filters-close-btn">
                    <AppIcon className={styles.closeIcon} Icon={CloseIcon}/>
                </Button>
            </div>
            <Accordion defaultValue={defaultOpenFilters}>
                <CheckboxFilterSection
                    title={t('productFilters.countries', 'Countries')}
                    value="countries"
                    options={facets?.countries}
                    selectedValues={currentCountries}
                    onToggle={handleCountryChange}
                    isLoading={isLoading}
                    error={hasError}
                    data-testid="filter-section-countries"
                />

                <CheckboxFilterSection
                    title={t('productFilters.brands', 'Brands')}
                    value="brands"
                    options={facets?.brands}
                    selectedValues={currentBrands}
                    onToggle={handleBrandChange}
                    isLoading={isLoading}
                    error={hasError}
                    data-testid="filter-section-brands"
                />

                <RangeFilterSection
                    title={t('productFilters.price', 'Price')}
                    value="price"
                    rangeValue={localPriceRange}
                    availableRange={facets?.priceRange}
                    onChange={handlePriceRangeChange}
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
            <Button disabled={!hasActiveFilters} fullWidth theme={"outline"} onClick={handleReset} data-testid="product-filters-reset-btn">
                {t('productFilters.reset', 'Reset')}
            </Button>
        </div>
    );
};