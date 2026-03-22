import {useGetInfiniteProducts, useGetProducts} from "./api/productApi/productApi";
import type {FacetItemType, Product, ProductsApiResponse} from "./model/types/Product";
import {ProductCard, type ProductCardProps} from "./ui/ProductCard/ProductCard";
import {ProductCardSkeleton} from "./ui/ProductCard/ProductCardSkeleton/ProductCardSkeleton.tsx";

export {ProductCard, ProductCardSkeleton, useGetInfiniteProducts, useGetProducts};
export type {FacetItemType, Product, ProductCardProps, ProductsApiResponse};
