import type {Cart} from "@/entities/cart";
import type {Product} from "@/entities/product/@x/cart";

import {baseAPI} from "@/shared/api";

export type CartProduct = Product;

export const addToCartApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        addToCart: build.mutation<Cart, {productId: string; quantity: number}>({
            query: (body) => ({
                url: "/cart/add",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart", "CartValidation"],
        }),
    }),
});

export const {useAddToCartMutation} = addToCartApi;
