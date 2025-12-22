import type {CurrencyType} from "@/shared/config";

interface ProductImage {
    url: string;
    alt: string;
    isMain: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    shortDescription: string;
    slug: string;
    price: number;
    oldPrice?: number;
    stock: number;
    images: ProductImage[];
    country?: string
    brand?: string
}

export interface ProductFacets {
    brands: FacetItemType[];
    countries: FacetItemType[];
    isStock: {
        true: number
        false: number
    }
    priceRange: PriceRangeType;
}

export interface ProductsApiResponse {
    products: Product[];
    total: number;
    hasMore: boolean
    facets: ProductFacets;
}

export interface ProductQuery {
    search?: string
    categorySlug?: string
    tagId?: string
    minPrice?: number
    maxPrice?: number
    brands?: string[];
    countries?: string[];
    inStock?: boolean
    limit?: number
    locale?: string
    currency?: CurrencyType
}

export type FacetItemType = { value: string, count: number }
export type PriceRangeType = { min?: number, max?: number }