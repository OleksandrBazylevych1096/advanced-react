import {
    SettingsOrdersStatusFilter,
    type SettingsOrderStatusFilterType,
} from "@/pages/settings/Orders/model/types/settingsOrders.ts";

interface OrderFilterTab {
    value: SettingsOrderStatusFilterType;
    labelKey: string;
}

export const orderFilterTabs: OrderFilterTab[] = [
    {
        value: SettingsOrdersStatusFilter.ALL,
        labelKey: "settings.pages.orders.filters.all",
    },
    {
        value: SettingsOrdersStatusFilter.IN_PROGRESS,
        labelKey: "settings.pages.orders.filters.inProgress",
    },
    {
        value: SettingsOrdersStatusFilter.COMPLETED,
        labelKey: "settings.pages.orders.filters.delivered",
    },
    {
        value: SettingsOrdersStatusFilter.CANCELLED,
        labelKey: "settings.pages.orders.filters.cancelled",
    },
];
