import {type OrderDetails} from "@/entities/order";

import type {Pagination} from "@/shared/api";

export const SettingsOrdersStatusFilter = {
    ALL: "all",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
}

export type SettingsOrderStatusFilterType = (typeof SettingsOrdersStatusFilter)[keyof typeof SettingsOrdersStatusFilter];


export interface SettingsOrdersListResponse {
    orders: OrderDetails[];
    pagination: Pagination
}

