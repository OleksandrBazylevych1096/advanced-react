import type {OrderType, SortType} from "@/features/productFilters/model/types/productFiltersSchema.ts";

export const DEBOUNCE_DELAY = 500;

export const URL_PARAMS = {
    COUNTRIES: 'countries',
    BRANDS: 'brands',
    MIN_PRICE: 'minPrice',
    MAX_PRICE: 'maxPrice',
    SORT_BY: 'sortBy',
    SORT_ORDER: 'sortOrder',
} as const;

export const DEFAULT_SORT_BY: SortType = 'name';
export const DEFAULT_SORT_ORDER: OrderType = 'asc';
