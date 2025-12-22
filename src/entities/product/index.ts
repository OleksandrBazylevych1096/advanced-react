import {Catalog} from "@/widgets/Catalog/ui/Catalog.tsx";

import type {Product, ProductsApiResponse} from "./model/types/Product";
import {ProductCard} from "./ui/ProductCard/ProductCard";
import {ProductCardSkeleton} from "./ui/ProductCard/ProductCardSkeleton/ProductCardSkeleton.tsx";

export {ProductCard, ProductCardSkeleton, Catalog};
export type {Product, ProductsApiResponse};
