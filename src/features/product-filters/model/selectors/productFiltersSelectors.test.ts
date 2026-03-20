import {describe, expect, test} from "vitest";

import {DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from "@/features/product-filters/consts/defaults.ts";

import {
    selectActiveFilters,
    selectActiveFiltersCount,
    selectHasActiveFilters,
    selectHasFilterChanges,
    selectInStock,
    selectProductFiltersIsOpen,
    selectSelectedBrands,
    selectSelectedCountries,
    selectSelectedPriceRange,
    selectSortBy,
    selectSortOrder,
    selectSortSettings,
} from "./productFiltersSelectors";

describe("productFiltersSelectors", () => {
    const createState = (productFilters?: StateSchema["productFilters"]) =>
        ({productFilters}) as unknown as StateSchema;

    test("returns defaults when reducer is not mounted", () => {
        const state = {} as StateSchema;

        expect(selectProductFiltersIsOpen(state)).toBe(false);
        expect(selectSelectedPriceRange(state)).toEqual({min: undefined, max: undefined});
        expect(selectSelectedBrands(state)).toEqual([]);
        expect(selectSelectedCountries(state)).toEqual([]);
        expect(selectInStock(state)).toBe(true);
        expect(selectSortSettings(state)).toEqual({
            sortBy: DEFAULT_SORT_BY,
            sortOrder: DEFAULT_SORT_ORDER,
        });
        expect(selectSortBy(state)).toBe(DEFAULT_SORT_BY);
        expect(selectSortOrder(state)).toBe(DEFAULT_SORT_ORDER);
        expect(selectActiveFilters(state)).toEqual({
            brands: [],
            countries: [],
            minPrice: undefined,
            maxPrice: undefined,
            inStock: true,
            sortBy: DEFAULT_SORT_BY,
            sortOrder: DEFAULT_SORT_ORDER,
        });
        expect(selectHasActiveFilters(state)).toBe(false);
        expect(selectActiveFiltersCount(state)).toBe(0);
        expect(selectHasFilterChanges(state)).toBe(false);
    });

    test("returns values from mounted reducer state", () => {
        const state = createState({
            isOpen: true,
            filters: {
                brands: ["Apple", "Samsung"],
                countries: ["US"],
                priceRange: {min: 10, max: 200},
                inStock: false,
                sortBy: "price",
                sortOrder: "desc",
            },
        });

        expect(selectProductFiltersIsOpen(state)).toBe(true);
        expect(selectSelectedPriceRange(state)).toEqual({min: 10, max: 200});
        expect(selectSelectedBrands(state)).toEqual(["Apple", "Samsung"]);
        expect(selectSelectedCountries(state)).toEqual(["US"]);
        expect(selectInStock(state)).toBe(false);
        expect(selectSortSettings(state)).toEqual({sortBy: "price", sortOrder: "desc"});
        expect(selectSortBy(state)).toBe("price");
        expect(selectSortOrder(state)).toBe("desc");
        expect(selectActiveFilters(state)).toEqual({
            brands: ["Apple", "Samsung"],
            countries: ["US"],
            minPrice: 10,
            maxPrice: 200,
            inStock: false,
            sortBy: "price",
            sortOrder: "desc",
        });
        expect(selectHasActiveFilters(state)).toBe(true);
        expect(selectActiveFiltersCount(state)).toBe(5);
        expect(selectHasFilterChanges(state)).toBe(true);
    });

    test("detects sort-only changes separately from active filters", () => {
        const state = createState({
            isOpen: false,
            filters: {
                brands: [],
                countries: [],
                priceRange: {min: undefined, max: undefined},
                inStock: true,
                sortBy: "rating",
                sortOrder: DEFAULT_SORT_ORDER,
            },
        });

        expect(selectHasActiveFilters(state)).toBe(false);
        expect(selectActiveFiltersCount(state)).toBe(0);
        expect(selectHasFilterChanges(state)).toBe(true);
    });
});
