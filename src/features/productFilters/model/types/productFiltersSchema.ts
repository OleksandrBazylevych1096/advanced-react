import type {PriceRangeType, ProductFacets} from "@/entities/product/model/types/Product.ts";

export interface ProductFiltersSchema {
    selected: {
        priceRange: PriceRangeType
        countries: string[]
        brands: string[]
        inStock: boolean;
        sortBy: SortType;
        sortOrder: OrderType;
    }
    facets: ProductFacets | null
}


export type SortType = 'price' | 'rating' | 'name'
export type OrderType = 'asc' | 'desc'