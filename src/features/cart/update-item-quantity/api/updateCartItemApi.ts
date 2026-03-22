import {baseAPI} from "@/shared/api";

export const updateCartItemApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        updateCartItem: build.mutation<void, {productId: string; quantity: number}>({
            query: ({productId, quantity}) => {
                if (quantity <= 0) {
                    return {
                        url: `/cart/item/${productId}`,
                        method: "DELETE",
                    };
                }

                return {
                    url: `/cart/item/${productId}`,
                    method: "PATCH",
                    body: {quantity},
                };
            },
            invalidatesTags: ["Cart", "CartValidation"],
        }),
    }),
});

export const {useUpdateCartItemMutation} = updateCartItemApi;
