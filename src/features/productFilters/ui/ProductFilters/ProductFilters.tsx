import {useProductFilters} from "@/features/productFilters/model/services/useProductFilters.ts";
import {
    CheckboxFilterSection
} from "@/features/productFilters/ui/ProductFilters/CheckboxFilterSection/CheckboxFilterSection.tsx";
import {
    RangeFilterSection
} from "@/features/productFilters/ui/ProductFilters/RangeFilterSection/RangeFilterSection.tsx";

import CloseIcon from '@/shared/assets/icons/Close.svg?react'
import {cn} from "@/shared/lib";
import {AppIcon, Button} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";


import styles from './ProductFilters.module.scss';

export type ProductFiltersSections = "countries" | 'brands' | 'price'

interface ProductFiltersProps {
    defaultOpenFilters?: ProductFiltersSections[]
}

export const ProductFilters = ({defaultOpenFilters}: ProductFiltersProps) => {
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
        handleSidebarClose
    } = useProductFilters();


    if (hasError && !facets) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>
                    Error while loading the data
                </p>
            </div>
        );
    }

    return (
        <div className={cn(styles.sidebar, {[styles.open]: isSidebarOpen})}>
            <div className={styles.header}>
                <h4 className={styles.title}>Filters</h4>
                <Button onClick={handleSidebarClose} theme={'ghost'}>
                    <AppIcon className={styles.closeIcon} Icon={CloseIcon}/>
                </Button>
            </div>
            <Accordion defaultValue={defaultOpenFilters}>
                <CheckboxFilterSection
                    title="Countries"
                    value="countries"
                    options={facets?.countries}
                    selectedValues={currentCountries}
                    onToggle={handleCountryChange}
                    isLoading={isLoading}
                    error={hasError}
                />

                <CheckboxFilterSection
                    title="Brands"
                    value="brands"
                    options={facets?.brands}
                    selectedValues={currentBrands}
                    onToggle={handleBrandChange}
                    isLoading={isLoading}
                    error={hasError}
                />

                <RangeFilterSection
                    title="Price"
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
                />
            </Accordion>
            <Button disabled={!hasActiveFilters} fullWidth theme={"outline"} onClick={handleReset}>Reset</Button>
        </div>
    );
};