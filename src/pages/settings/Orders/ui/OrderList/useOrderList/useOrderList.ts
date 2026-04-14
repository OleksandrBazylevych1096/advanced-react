import {useCallback, useRef} from "react";
import type {List as ListType} from "react-virtualized";

import {useGetMyOrdersInfiniteQuery} from "@/pages/settings/Orders/api/settingsOrdersApi.ts";
import {SETTINGS_ORDERS_DEFAULT_LIMIT} from "@/pages/settings/Orders/config/constants.ts";
import {mapSettingFilterStatusToOrderStatus} from "@/pages/settings/Orders/lib/mapSettingFilterStatusToOrderStatus.ts";
import type {SettingsOrderStatusFilterType} from "@/pages/settings/Orders/model/types/settingsOrders.ts";

const LOAD_MORE_THRESHOLD = 0.2;

interface UseSettingsOrdersArgs {
    activeFilter: SettingsOrderStatusFilterType;
}

export const useOrderList = ({activeFilter}: UseSettingsOrdersArgs) => {
    const isLoadingMore = useRef(false);
    const listRef = useRef<ListType>(null);
    const status = mapSettingFilterStatusToOrderStatus(activeFilter);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useGetMyOrdersInfiniteQuery({
        status,
        limit: SETTINGS_ORDERS_DEFAULT_LIMIT,
    });

    const orders = data?.pages.flatMap((page) => page.orders) ?? [];
    const isRefetching = isFetching && !isFetchingNextPage && !isLoading;

    const loadMore = useCallback(
        (params: {rowsCount: number; stopIndex: number; threshold?: number}) => {
            const {rowsCount, stopIndex, threshold = LOAD_MORE_THRESHOLD} = params;

            if (isLoadingMore.current || !hasNextPage || isFetchingNextPage) {
                return;
            }

            const loadThreshold = Math.max(2, Math.floor(rowsCount * threshold));

            if (stopIndex >= rowsCount - loadThreshold) {
                isLoadingMore.current = true;
                fetchNextPage().finally(() => {
                    isLoadingMore.current = false;
                });
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage],
    );

    return {
        data: {
            orders,
            hasNextPage,
        },
        status: {
            isLoading: isLoading || isRefetching,
            isError,
            error,
            isFetchingNextPage,
        },
        actions: {
            loadMore,
            refetch,
        },
        refs: {
            listRef,
        },
    };
};
