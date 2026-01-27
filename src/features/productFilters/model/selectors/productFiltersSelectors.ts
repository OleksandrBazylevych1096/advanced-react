import {createSelector} from "@reduxjs/toolkit";

import type {StateSchema} from "@/app/store";

import {DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from "@/features/productFilters/consts/defaults.ts";


export const selectProductFilters = (state: StateSchema) => state.productFilters;

export const selectProductFiltersIsOpen = createSelector(
    selectProductFilters,
    (state) => state?.isOpen ?? false
);

export const selectSelectedPriceRange = createSelector(
    selectProductFilters,
    (state) => state?.filters.priceRange ?? {min: undefined, max: undefined}
);

export const selectSelectedBrands = createSelector(
    selectProductFilters,
    (state) => state?.filters.brands ?? []
);

export const selectSelectedCountries = createSelector(
    selectProductFilters,
    (state) => state?.filters.countries ?? []
);

export const selectInStock = createSelector(
    selectProductFilters,
    (state) => state?.filters.inStock ?? true
);

export const selectSortSettings = createSelector(
    selectProductFilters,
    (state) => ({
        sortBy: state?.filters.sortBy ?? DEFAULT_SORT_BY,
        sortOrder: state?.filters.sortOrder ?? DEFAULT_SORT_ORDER
    })
);

export const selectSortBy = createSelector(
    selectProductFilters,
    (state) => state?.filters.sortBy ?? DEFAULT_SORT_BY
);

export const selectSortOrder = createSelector(
    selectProductFilters,
    (state) => state?.filters.sortOrder ?? DEFAULT_SORT_ORDER
);

export const selectActiveFilters = createSelector(
    selectProductFilters,
    (state) => ({
        brands: state?.filters.brands,
        countries: state?.filters.countries,
        minPrice: state?.filters.priceRange.min,
        maxPrice: state?.filters.priceRange.max,
        inStock: state?.filters.inStock,
        sortBy: state?.filters.sortBy,
        sortOrder: state?.filters.sortOrder
    })
);

export const selectHasActiveFilters = createSelector(
    selectProductFilters,
    (state) => {
        const filters = state?.filters;
        if (!filters) return false;

        return (
            (filters.brands?.length ?? 0) > 0 ||
            (filters.countries?.length ?? 0) > 0 ||
            filters.priceRange.min !== undefined ||
            filters.priceRange.max !== undefined
        );
    }
);

export const selectActiveFiltersCount = createSelector(
    selectProductFilters,
    (state) => {
        const filters = state?.filters;
        if (!filters) return 0;

        let count = 0;

        if (filters.brands?.length) count += filters.brands.length;
        if (filters.countries?.length) count += filters.countries.length;
        if (filters.priceRange.min !== undefined) count += 1;
        if (filters.priceRange.max !== undefined) count += 1;

        return count;
    }
);

export const selectHasFilterChanges = createSelector(
    selectProductFilters,
    (state) => {
        const filters = state?.filters;
        if (!filters) return false;

        return (
            (filters.brands?.length ?? 0) > 0 ||
            (filters.countries?.length ?? 0) > 0 ||
            filters.priceRange.min !== undefined ||
            filters.priceRange.max !== undefined ||
            filters.sortBy !== DEFAULT_SORT_BY ||
            filters.sortOrder !== DEFAULT_SORT_ORDER
        );
    }
);