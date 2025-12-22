import {createSelector} from "@reduxjs/toolkit";

import {type StateSchema} from "@/app/store";

export const selectProductFilters = (state: StateSchema) => state.productFilters;

export const selectSelectedPriceRange = createSelector(
    selectProductFilters,
    (productFilters) => productFilters?.selected.priceRange
);

export const selectAvailablePriceRange = createSelector(
    selectProductFilters,
    (productFilters) => productFilters?.facets?.priceRange ?? null
);

export const selectEffectivePriceRange = createSelector(
    selectSelectedPriceRange,
    selectAvailablePriceRange,
    (selected, available) => {
        if (!available || available.min === undefined ||
            available.max === undefined || !selected) return null

        return {
            min: selected.min ?? available.min,
            max: selected.max ?? available.max
        };
    }
);

export const selectSelectedBrands = createSelector(
    selectProductFilters,
    (filters) => filters?.selected.brands ?? []
);

export const selectSelectedCountries = createSelector(
    selectProductFilters,
    (filters) => filters?.selected.countries ?? []
);

export const selectSortSettings = createSelector(
    selectProductFilters,
    (filters) => filters ? {
        sortBy: filters.selected.sortBy,
        sortOrder: filters.selected.sortOrder
    } : null
);

export const selectFacets = createSelector(
    selectProductFilters,
    (filters) => filters?.facets ?? null
);

export const selectActiveFilters = createSelector(
    selectProductFilters,
    (filters) => {
        if (!filters) return null;

        const {brands, countries, priceRange} = filters.selected;

        return {
            // Повертаємо масиви як є
            brands: brands.length > 0 ? brands : undefined,
            countries: countries.length > 0 ? countries : undefined,
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
        };
    }
);

// Селектор для підрахунку кількості активних фільтрів
export const selectActiveFiltersCount = createSelector(
    selectProductFilters,
    (filters) => {
        if (!filters) return 0;

        let count = 0;
        const {brands, countries, priceRange} = filters.selected;
        const {facets} = filters;

        if (brands.length > 0) count += brands.length;
        if (countries.length > 0) count += countries.length;

        // Перевіряємо чи змінено ціновий діапазон
        if (facets?.priceRange) {
            if (priceRange.min !== undefined && priceRange.min !== facets.priceRange.min) count++;
            if (priceRange.max !== undefined && priceRange.max !== facets.priceRange.max) count++;
        }

        return count;
    }
);