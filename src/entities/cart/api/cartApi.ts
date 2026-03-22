import {baseAPI, type ApiLocaleCurrencyParams} from "@/shared/api";

import type {Cart, CartValidationItem} from "../state/types/CartSchema";

interface SyncCartRequest extends ApiLocaleCurrencyParams {
    guestCartItems: {productId: string; quantity: number}[];
}

export const cartApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getCart: build.query<Cart, ApiLocaleCurrencyParams>({
            query: ({locale, currency}) => ({
                url: "/cart",
                params: {locale, currency},
            }),
            providesTags: ["Cart"],
        }),

        getCartCount: build.query<number, ApiLocaleCurrencyParams>({
            query: ({locale, currency}) => ({
                url: "/cart/count",
                params: {locale, currency},
            }),
            providesTags: ["Cart"],
        }),

        validateCart: build.query<CartValidationItem[], ApiLocaleCurrencyParams>({
            query: ({locale}) => ({
                url: "/cart/validate",
                params: {locale},
            }),
            providesTags: ["CartValidation"],
        }),

        syncCart: build.mutation<Cart, SyncCartRequest>({
            query: ({guestCartItems, locale, currency}) => ({
                url: "/cart/sync",
                method: "POST",
                params: {locale, currency},
                body: {guestCartItems},
            }),
            invalidatesTags: ["Cart", "CartValidation"],
        }),
    }),
});

export const {useGetCartQuery, useGetCartCountQuery, useValidateCartQuery, useSyncCartMutation} =
    cartApi;

