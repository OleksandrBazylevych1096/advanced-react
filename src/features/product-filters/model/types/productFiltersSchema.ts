import type {PriceRangeType} from "@/entities/product";

export interface ProductFiltersSchema {
    filters: {
        priceRange: PriceRangeType;
        countries: string[];
        brands: string[];
        inStock: boolean;
        sortBy: SortType;
        sortOrder: OrderType;
    };
    isOpen: boolean;
}

export type SortType = "price" | "rating" | "name";
export type OrderType = "asc" | "desc";

