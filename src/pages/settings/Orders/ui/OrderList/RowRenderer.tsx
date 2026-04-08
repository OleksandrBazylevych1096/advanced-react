import type {CSSProperties} from "react";

import {SETTINGS_ORDERS_ROW_GAP} from "@/pages/settings/Orders/config/constants.ts";
import {OrderCard} from "@/pages/settings/Orders/ui/OrderCard/OrderCard.tsx";
import {OrderCardSkeleton} from "@/pages/settings/Orders/ui/OrderCard/OrderCardSkeleton.tsx";
import type {OrderListItem} from "@/pages/settings/Orders/ui/OrderList/OrderList.tsx";

import type {OrderDetails} from "@/entities/order";

export const RowRenderer = ({
    index,
    key,
    style,
    allItems,
}: {
    index: number;
    key: string;
    style: CSSProperties;
    allItems: OrderListItem[];
}) => {
    const item = allItems[index];
    const adjustedStyle: CSSProperties = {
        ...style,
        top: (style.top as number) + SETTINGS_ORDERS_ROW_GAP / 2,
        height: (style.height as number) - SETTINGS_ORDERS_ROW_GAP,
    };
    const isOrder = (item: OrderListItem): item is OrderDetails => {
        return item !== undefined && typeof item === "object" && "id" in item;
    };

    return (
        <div key={key} style={adjustedStyle}>
            {isOrder(item) ? <OrderCard order={item} /> : <OrderCardSkeleton />}
        </div>
    );
};
