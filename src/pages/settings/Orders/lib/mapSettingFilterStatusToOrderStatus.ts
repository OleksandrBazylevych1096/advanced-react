import {
    SettingsOrdersStatusFilter,
    type SettingsOrderStatusFilterType,
} from "@/pages/settings/Orders/model/types/settingsOrders.ts";

import {OrderStatus} from "@/entities/order";

export const mapSettingFilterStatusToOrderStatus = (status: SettingsOrderStatusFilterType) => {
    if (status === SettingsOrdersStatusFilter.ALL) return;
    if (status === SettingsOrdersStatusFilter.CANCELLED)
        return [OrderStatus.CANCELLED, OrderStatus.REFUNDED];
    if (status === SettingsOrdersStatusFilter.COMPLETED) return [OrderStatus.DELIVERED];
    if (status === SettingsOrdersStatusFilter.IN_PROGRESS)
        return [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PROCESSING,
            OrderStatus.SHIPPED,
        ];
};
