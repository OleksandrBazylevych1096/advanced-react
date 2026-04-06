import {type OrderDetails} from "@/entities/order";

export const SettingsOrdersStatusFilter = {
    ALL: "all",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
}

export type SettingsOrderStatusFilterType = (typeof SettingsOrdersStatusFilter)[keyof typeof SettingsOrdersStatusFilter];


export interface SettingsOrdersListResponse {
    orders: OrderDetails[];
    // TODO - create shared type for pagination
    pagination: {
        hasNext: boolean;
        hasPrev: boolean;
        limit: number
        page: number;
        total: number
        totalPages: number
    };
}

