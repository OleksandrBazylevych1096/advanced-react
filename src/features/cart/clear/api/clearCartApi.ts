import {baseAPI} from "@/shared/api";

export const clearCartApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        clearCart: build.mutation<void, void>({
            query: () => ({
                url: "/cart/clear",
                method: "DELETE",
            }),
            invalidatesTags: ["Cart", "CartValidation"],
        }),
    }),
});

export const {useClearCartMutation} = clearCartApi;
