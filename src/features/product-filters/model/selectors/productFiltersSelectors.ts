import {createSelector} from "@reduxjs/toolkit";

import {DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from "@/features/product-filters/config/defaults.ts";

export const selectProductFilters = (state: StateSchema) => state.productFilters;
const selectProductFiltersState = (state: StateSchema) => state.productFilters?.filters;

export const selectProductFiltersIsOpen = createSelector(
    selectProductFilters,
    (state) => state?.isOpen ?? false,
);

export const selectSelectedPriceRange = createSelector(
    selectProductFiltersState,
    (filters) => filters?.priceRange ?? {min: undefined, max: undefined},
);

export const selectSelectedBrands = createSelector(
    selectProductFiltersState,
    (filters) => filters?.brands ?? [],
);

export const selectSelectedCountries = createSelector(
    selectProductFiltersState,
    (filters) => filters?.countries ?? [],
);

export const selectInStock = createSelector(
    selectProductFiltersState,
    (filters) => filters?.inStock ?? true,
);

export const selectSortSettings = createSelector(selectProductFiltersState, (filters) => ({
    sortBy: filters?.sortBy ?? DEFAULT_SORT_BY,
    sortOrder: filters?.sortOrder ?? DEFAULT_SORT_ORDER,
}));

export const selectSortBy = createSelector(
    selectProductFiltersState,
    (filters) => filters?.sortBy ?? DEFAULT_SORT_BY,
);

export const selectSortOrder = createSelector(
    selectProductFiltersState,
    (filters) => filters?.sortOrder ?? DEFAULT_SORT_ORDER,
);

export const selectActiveFilters = createSelector(selectProductFiltersState, (filters) => ({
    brands: filters?.brands ?? [],
    countries: filters?.countries ?? [],
    minPrice: filters?.priceRange.min,
    maxPrice: filters?.priceRange.max,
    inStock: filters?.inStock ?? true,
    sortBy: filters?.sortBy ?? DEFAULT_SORT_BY,
    sortOrder: filters?.sortOrder ?? DEFAULT_SORT_ORDER,
}));

export const selectHasActiveFilters = createSelector(selectProductFiltersState, (filters) => {
    if (!filters) return false;

    return (
        (filters.brands?.length ?? 0) > 0 ||
        (filters.countries?.length ?? 0) > 0 ||
        filters.priceRange.min !== undefined ||
        filters.priceRange.max !== undefined
    );
});

export const selectActiveFiltersCount = createSelector(selectProductFiltersState, (filters) => {
    if (!filters) return 0;

    let count = 0;

    if (filters.brands?.length) count += filters.brands.length;
    if (filters.countries?.length) count += filters.countries.length;
    if (filters.priceRange.min !== undefined) count += 1;
    if (filters.priceRange.max !== undefined) count += 1;

    return count;
});

export const selectHasFilterChanges = createSelector(selectProductFiltersState, (filters) => {
    if (!filters) return false;

    return (
        (filters.brands?.length ?? 0) > 0 ||
        (filters.countries?.length ?? 0) > 0 ||
        filters.priceRange.min !== undefined ||
        filters.priceRange.max !== undefined ||
        filters.sortBy !== DEFAULT_SORT_BY ||
        filters.sortOrder !== DEFAULT_SORT_ORDER
    );
});
