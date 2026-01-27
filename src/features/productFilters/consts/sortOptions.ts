import type {SelectOption} from "@/shared/ui/Select/Select.tsx";

import type {OrderType, SortType} from "../model/types/productFiltersSchema";

export type SortOptionValue = `${SortType}-${OrderType}`;

export const VALID_SORT_BY_VALUES: readonly SortType[] = ['name', 'price', 'rating'] as const;
export const VALID_SORT_ORDER_VALUES: readonly OrderType[] = ['asc', 'desc'] as const;

export const SORT_OPTIONS: SelectOption<SortOptionValue>[] = [
    {label: 'Name (A–Z)', value: 'name-asc'},
    {label: 'Name (Z–A)', value: 'name-desc'},
    {label: 'Price (Low to High)', value: 'price-asc'},
    {label: 'Price (High to Low)', value: 'price-desc'},
    {label: 'Rating (Low to High)', value: 'rating-asc'},
    {label: 'Rating (High to Low)', value: 'rating-desc'},
] as const;
