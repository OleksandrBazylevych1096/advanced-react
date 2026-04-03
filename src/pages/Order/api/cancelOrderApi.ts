import {baseAPI} from "@/shared/api";

interface CancelOrderRequest {
    id: string;
}

export const cancelOrderApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        cancelOrder: build.mutation<unknown, CancelOrderRequest>({
            query: ({id}) => ({
                url: `/orders/${id}/cancel`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, {id}) => [{type: "Order", id}],
        }),
    }),
});

export const {useCancelOrderMutation} = cancelOrderApi;
