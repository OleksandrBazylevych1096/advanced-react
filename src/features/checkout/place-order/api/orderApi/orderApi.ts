import {type ApiLocaleParams, baseAPI} from "@/shared/api";

import type {OrderDetails} from "../../model/types/checkoutTypes";

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
        }),
    }),
});

export const {useGetOrderByIdQuery, useLazyGetOrderByIdQuery} = orderApi;
