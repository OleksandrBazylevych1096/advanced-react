import type {Pagination} from "@/shared/api";
import type {CurrencyType, SupportedLngsType} from "@/shared/config";

export interface ProductImage {
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
    country?: string;
    brand?: string;
    categoryId: string;
    slugMap: Record<SupportedLngsType, string>;
}

export interface ProductFacets {
    brands: FacetItemType[];
    countries: FacetItemType[];
    priceRange: PriceRangeType;
}

export interface ProductsApiResponse {
    products: Product[];
    pagination: Pagination;
    facets: ProductFacets;
}

export interface ProductQuery {
    searchQuery?: string;
    categorySlug?: string;
    categoryId?: string;
    tagId?: string;
    minPrice?: number;
    maxPrice?: number;
    brands?: string[];
    countries?: string[];
    inStock?: boolean;
    limit?: number;
    locale?: string;
    currency?: CurrencyType;
}

export type FacetItemType = {label?: string; value: string; count: number};
export type PriceRangeType = {min?: number; max?: number};
