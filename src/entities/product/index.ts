import {useGetInfiniteProducts, useGetProducts} from "./api/productApi";
import {productsHandlers} from "./api/test/handlers";
import {
    createMockFacets,
    createMockProduct,
    emptyFacets,
    mockFacets,
    mockProductBrands,
    mockProductCountries,
    mockProducts,
} from "./api/test/mockData";
import type {FacetItemType, Product, ProductsApiResponse} from "./model/types/Product";
import {ProductCard, type ProductCardProps} from "./ui/ProductCard/ProductCard";
import {ProductCardSkeleton} from "./ui/ProductCard/ProductCardSkeleton/ProductCardSkeleton.tsx";

export {ProductCard, ProductCardSkeleton, useGetInfiniteProducts, useGetProducts};
export type {FacetItemType, Product, ProductCardProps, ProductsApiResponse};

// Test-only exports
export {
    productsHandlers,
    createMockFacets,
    createMockProduct,
    emptyFacets,
    mockFacets,
    mockProductBrands,
    mockProductCountries,
    mockProducts,
};
