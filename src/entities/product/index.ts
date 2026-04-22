import {
    useGetInfiniteBestSellers,
    useGetInfiniteProducts,
    useGetProducts,
} from "./api/productApi/productApi";
import type {
    FacetItemType,
    PriceRangeType,
    Product,
    ProductFacets,
    ProductImage,
    ProductsApiResponse,
} from "./model/types/Product";
import {ProductCard, type ProductCardProps} from "./ui/ProductCard/ProductCard";
import {ProductCardSkeleton} from "./ui/ProductCardSkeleton/ProductCardSkeleton.tsx";

export {
    ProductCard,
    ProductCardSkeleton,
    useGetInfiniteBestSellers,
    useGetInfiniteProducts,
    useGetProducts,
};

export type {
    FacetItemType,
    Product,
    ProductCardProps,
    ProductFacets,
    ProductsApiResponse,
    PriceRangeType,
    ProductImage,
};
