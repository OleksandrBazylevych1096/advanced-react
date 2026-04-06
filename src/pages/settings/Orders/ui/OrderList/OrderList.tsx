import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {AutoSizer, WindowScroller, type WindowScrollerChildProps} from "react-virtualized";
import {List as VirtualizedList} from "react-virtualized/dist/es/List";

import {SETTINGS_ORDERS_ROW_HEIGHT, SETTINGS_ORDERS_SKELETON_COUNT} from "@/pages/settings/Orders/config/constants.ts";
import type {SettingsOrderStatusFilterType} from "@/pages/settings/Orders/model/types/settingsOrders.ts";
import {OrderCardSkeleton} from "@/pages/settings/Orders/ui/OrderCard/OrderCardSkeleton.tsx";
import {RowRenderer} from "@/pages/settings/Orders/ui/OrderList/RowRenderer.tsx";
import {useOrderList} from "@/pages/settings/Orders/ui/OrderList/useOrderList/useOrderList.ts";


import type {OrderDetails} from "@/entities/order";

import {Stack} from "@/shared/ui/Stack";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";

import styles from "./OrderList.module.scss";


export type OrderListItem = OrderDetails | undefined

interface OrderListProps {
    activeFilter: SettingsOrderStatusFilterType
}

export const OrderList = (props: OrderListProps) => {
    const {activeFilter} = props;
    const {t} = useTranslation();
    const {
        data: {orders, hasNextPage},
        status: {isLoading, isError, isFetchingNextPage},
        actions: {loadMore, refetch},
        refs: {listRef},
    } = useOrderList({activeFilter});

    const allItems = useMemo<OrderListItem[]>(
        () => [
            ...orders,
            ...(isFetchingNextPage
                ? Array.from<undefined>({length: SETTINGS_ORDERS_SKELETON_COUNT}).fill(undefined)
                : []),
        ],
        [orders, isFetchingNextPage],
    );

    if (isLoading) {
        return (
            <Stack className={styles.cards} gap={12}>
                {Array.from({length: SETTINGS_ORDERS_SKELETON_COUNT}).map((_, index) => (
                    <OrderCardSkeleton key={index}/>
                ))}
            </Stack>
        )

    }
    if (isError) {
        return (
            <ErrorState
                message={t("settings.pages.orders.error")}
                onRetry={() => {
                    void refetch();
                }}
            />
        )
    }

    if (!orders || orders.length === 0) {
        return (
            <EmptyState
                title={t("settings.pages.orders.emptyTitle")}
                description={t("settings.pages.orders.emptyDescription")}
            />
        )
    }


    return (
        <div className={styles.cards}>
            <WindowScroller>
                {({height, isScrolling, onChildScroll, scrollTop}: WindowScrollerChildProps) => (
                    <AutoSizer disableHeight>
                        {({width}: { width: number }) => (
                            <VirtualizedList
                                ref={listRef}
                                autoHeight
                                width={width}
                                height={height}
                                rowCount={allItems.length}
                                rowHeight={SETTINGS_ORDERS_ROW_HEIGHT}
                                rowRenderer={(props) => RowRenderer({...props, allItems})}
                                isScrolling={isScrolling}
                                onScroll={onChildScroll}
                                scrollTop={scrollTop}
                                overscanRowCount={3}
                                onRowsRendered={({stopIndex}) => {
                                    if (hasNextPage) {
                                        loadMore({
                                            rowsCount: allItems.length,
                                            stopIndex,
                                        });
                                    }
                                }}
                            />
                        )}
                    </AutoSizer>
                )}
            </WindowScroller>
        </div>
    )

}