import {baseAPI} from "@/shared/api";

import type {Cart, CartValidationItem} from "../model/types/CartSchema";

export const cartApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCart: build.query<Cart, void>({
            query: () => ({url: "/cart"}),
            providesTags: ["Cart"],
        }),

        getCartCount: build.query<number, void>({
            query: () => ({url: "/cart/count"}),
            providesTags: ["Cart"],
        }),

        validateCart: build.query<CartValidationItem[], void>({
            query: () => ({url: "/cart/validate"}),
            providesTags: ["CartValidation"],
        }),

        syncCart: build.mutation<Cart, {guestCartItems: {productId: string; quantity: number}[]}>({
            query: (body) => ({
                url: "/cart/sync",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart", "CartValidation"],
        }),
    }),
});

export const {
    useGetCartQuery,
    useGetCartCountQuery,
    useValidateCartQuery,
    useSyncCartMutation,
} = cartApi;
