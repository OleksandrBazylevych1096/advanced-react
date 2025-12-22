import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import {productApi} from "@/entities/product/api/productApi";
import type {PriceRangeType, ProductFacets} from "@/entities/product/model/types/Product";

import type {ProductFiltersSchema} from "../types/productFiltersSchema";

export const initialState: ProductFiltersSchema = {
    selected: {
        brands: [],
        countries: [],
        inStock: true,
        priceRange: {min: undefined, max: undefined},
        sortBy: 'name',
        sortOrder: 'asc'
    },
    facets: null
};

export const productFiltersSlice = createSlice({
    name: "productFilters",
    initialState,
    reducers: {
        setSelectedPriceRange: (state, action: PayloadAction<PriceRangeType>) => {
            state.selected.priceRange = action.payload;
        },
        setSelectedBrands: (state, action: PayloadAction<string[]>) => {
            state.selected.brands = action.payload;
        },
        setSelectedCountries: (state, action: PayloadAction<string[]>) => {
            state.selected.countries = action.payload;
        },
        toggleCountry: (state, action: PayloadAction<string>) => {
            const country = action.payload;
            const index = state.selected.countries.indexOf(country);

            if (index > -1) {
                state.selected.countries.splice(index, 1);
            } else {
                state.selected.countries.push(country);
            }
        },
        toggleBrand: (state, action: PayloadAction<string>) => {
            const brand = action.payload;
            const index = state.selected.brands.indexOf(brand);

            if (index > -1) {
                state.selected.brands.splice(index, 1);
            } else {
                state.selected.brands.push(brand);
            }
        },
        resetPriceRange: (state) => {
            state.selected.priceRange = {min: undefined, max: undefined};
        },
        resetFilters: (state) => {
            state.selected.brands = [];
            state.selected.countries = [];
            state.selected.priceRange = {
                min: state.facets?.priceRange.min,
                max: state.facets?.priceRange.max
            };
        },
        syncFacets: (state, action: PayloadAction<ProductFacets>) => {
            const newFacets = action.payload;
            state.facets = newFacets;

            const currentMin = state.selected.priceRange.min;
            const currentMax = state.selected.priceRange.max;
            const newMin = newFacets.priceRange.min;
            const newMax = newFacets.priceRange.max;

            if (newMin === undefined || newMax === undefined) {
                return;
            }

            const shouldUpdateMin =
                currentMin === undefined ||
                currentMin === state.facets?.priceRange.min ||
                currentMin < newMin ||
                currentMin > newMax;

            const shouldUpdateMax =
                currentMax === undefined ||
                currentMax === state.facets?.priceRange.max ||
                currentMax > newMax ||
                currentMax < newMin;

            if (shouldUpdateMin) {
                state.selected.priceRange.min = newMin;
            }
            if (shouldUpdateMax) {
                state.selected.priceRange.max = newMax;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            productApi.endpoints.getProducts.matchFulfilled,
            (state, action) => {
                const newFacets = action.payload.facets;
                state.facets = newFacets;

                if (state.selected.priceRange.min === undefined) {
                    state.selected.priceRange.min = newFacets.priceRange.min;
                }
                if (state.selected.priceRange.max === undefined) {
                    state.selected.priceRange.max = newFacets.priceRange.max;
                }
            }
        ).addMatcher(
            productApi.endpoints.getInfiniteProducts.matchFulfilled,
            (state, action) => {
                const lastPage = action.payload.pages[action.payload.pages.length - 1];
                const newFacets = lastPage.facets;
                state.facets = newFacets;

                if (state.selected.priceRange.min === undefined) {
                    state.selected.priceRange.min = newFacets.priceRange.min;
                }
                if (state.selected.priceRange.max === undefined) {
                    state.selected.priceRange.max = newFacets.priceRange.max;
                }
            }
        );
    }
});

export const {actions: productFiltersActions, reducer: productFiltersReducer} = productFiltersSlice;