import {ProductCard, type ProductCardProps} from "@/entities/product";

import {AddToCartButton} from "../AddToCartButton/AddToCartButton";

type ProductCardWithAddToCartProps = Omit<ProductCardProps, "action">;

export const ProductCardWithAddToCart = (props: ProductCardWithAddToCartProps) => {
    return <ProductCard {...props} action={<AddToCartButton product={props.product} compact />} />;
};
