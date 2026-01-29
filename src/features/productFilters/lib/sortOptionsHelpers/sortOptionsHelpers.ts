import {
    type SortOptionValue,
    VALID_SORT_BY_VALUES,
    VALID_SORT_ORDER_VALUES
} from "@/features/productFilters/consts/sortOptions.ts";
import type {OrderType, SortType} from "@/features/productFilters/model/types/productFiltersSchema.ts";

export const createSortValue = (sortBy: SortType, sortOrder: OrderType): SortOptionValue => {
    return `${sortBy}-${sortOrder}`;
};

export const parseSortValue = (value: SortOptionValue): { sortBy: SortType; sortOrder: OrderType } => {
    const [sortBy, sortOrder] = value.split('-') as [SortType, OrderType];
    return {sortBy, sortOrder};
};

export const isValidSortBy = (value: string | null): value is SortType => {
    return value !== null && VALID_SORT_BY_VALUES.includes(value as SortType);
};

export const isValidSortOrder = (value: string | null): value is OrderType => {
    return value !== null && VALID_SORT_ORDER_VALUES.includes(value as OrderType);
};