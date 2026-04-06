import type {OrderStatusType} from "@/entities/order";

import {baseAPI} from "@/shared/api";

import type {SettingsOrdersListResponse} from "../model/types/settingsOrders";

interface GetMyOrdersRequest {
    status?: OrderStatusType[];
    limit: number;
}

export const settingsOrdersApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getMyOrders: build.infiniteQuery<SettingsOrdersListResponse, GetMyOrdersRequest, number>({
            infiniteQueryOptions: {
                initialPageParam: 1,
                getNextPageParam: (lastPage) => {
                    const {hasNext, page, totalPages} = lastPage.pagination;

                    if (hasNext) return page + 1;
                    if (page < totalPages) return page + 1;

                    return undefined;
                },
            },
            query: ({queryArg, pageParam}) => ({
                url: "/orders/my-orders",
                params: {
                    status: queryArg.status,
                    page: pageParam,
                    limit: queryArg.limit,
                },
            }),
            providesTags: (result) => {
                const orderTags =
                    result?.pages
                        ?.flatMap((page) => page.orders)
                        .map((order) => ({type: "Order" as const, id: order.id})) ?? [];

                return [{type: "Order" as const, id: "LIST"}, ...orderTags];
            },
        }),
    }),
});

export const {useGetMyOrdersInfiniteQuery} = settingsOrdersApi;
