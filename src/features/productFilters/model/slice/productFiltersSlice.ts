import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import {DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from "@/features/productFilters/consts/defaults.ts";

import type {PriceRangeType} from "@/entities/product/model/types/Product.ts";

import type {OrderType, ProductFiltersSchema, SortType} from "../types/productFiltersSchema";

export const initialState: ProductFiltersSchema = {
    filters: {
        brands: [],
        countries: [],
        inStock: true,
        priceRange: {min: undefined, max: undefined},
        sortBy: DEFAULT_SORT_BY,
        sortOrder: DEFAULT_SORT_ORDER,
    },
    isOpen: false,
};

export const productFiltersSlice = createSlice({
    name: "productFilters",
    initialState,
    reducers: {
        setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
        toggleIsOpen: (state) => {
            state.isOpen = !state.isOpen;
        },
        setSelectedPriceRange: (state, action: PayloadAction<PriceRangeType>) => {
            state.filters.priceRange = action.payload;
        },
        resetPriceRange: (state) => {
            state.filters.priceRange = {min: undefined, max: undefined};
        },
        setSelectedCountries: (state, action: PayloadAction<string[]>) => {
            state.filters.countries = action.payload;
        },
        toggleCountry: (state, action: PayloadAction<string>) => {
            const value = action.payload;
            const arr = state.filters.countries;
            const index = arr.indexOf(value);

            if (index > -1) arr.splice(index, 1);
            else arr.push(value);
        },
        setSelectedBrands: (state, action: PayloadAction<string[]>) => {
            state.filters.brands = action.payload;
        },
        toggleBrand: (state, action: PayloadAction<string>) => {
            const value = action.payload;
            const arr = state.filters.brands;
            const index = arr.indexOf(value);

            if (index > -1) arr.splice(index, 1);
            else arr.push(value);
        },
        setInStock: (state, action: PayloadAction<boolean>) => {
            state.filters.inStock = action.payload;
        },
        setSortBy: (state, action: PayloadAction<SortType>) => {
            state.filters.sortBy = action.payload;
        },
        setSortOrder: (state, action: PayloadAction<OrderType>) => {
            state.filters.sortOrder = action.payload;
        },
        resetFilters: (state) => {
            state.filters = {
                brands: [],
                countries: [],
                inStock: true,
                priceRange: {min: undefined, max: undefined},
                sortBy: DEFAULT_SORT_BY,
                sortOrder: DEFAULT_SORT_ORDER,
            }
        },
    },
});

export const {actions: productFiltersActions, reducer: productFiltersReducer} = productFiltersSlice;