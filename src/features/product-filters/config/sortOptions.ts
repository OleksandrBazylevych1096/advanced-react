import type {OrderType, SortType} from "../model/types/productFiltersSchema";

export type SortOptionValue = `${SortType}-${OrderType}`;

export interface SortOptionConfig {
    labelKey: string;
    value: SortOptionValue;
}

export const VALID_SORT_BY_VALUES: readonly SortType[] = ["name", "price", "rating"] as const;
export const VALID_SORT_ORDER_VALUES: readonly OrderType[] = ["asc", "desc"] as const;

export const SORT_OPTIONS: SortOptionConfig[] = [
    {labelKey: "productFilters.sort.nameAsc", value: "name-asc"},
    {labelKey: "productFilters.sort.nameDesc", value: "name-desc"},
    {labelKey: "productFilters.sort.priceAsc", value: "price-asc"},
    {labelKey: "productFilters.sort.priceDesc", value: "price-desc"},
    {labelKey: "productFilters.sort.ratingAsc", value: "rating-asc"},
    {labelKey: "productFilters.sort.ratingDesc", value: "rating-desc"},
] as const;
