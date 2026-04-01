import type {OrderDetails} from "@/entities/order";

import {type ApiLocaleParams, baseAPI} from "@/shared/api";

interface GetOrderByIdRequest extends ApiLocaleParams {
    orderId: string;
}

export const orderApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getOrderById: build.query<OrderDetails, GetOrderByIdRequest>({
            query: ({orderId, locale}) => ({
                url: `/orders/${orderId}`,
                params: {locale},
            }),
            providesTags: (_result, _error, {orderId}) => [{type: "Order", id: orderId}],
        }),
    }),
});

export const {useGetOrderByIdQuery, useLazyGetOrderByIdQuery} = orderApi;
