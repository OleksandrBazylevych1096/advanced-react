import type {FC} from "react";

import type {OrderStatusType, OrderTimelineEvent} from "@/entities/order";

import CheckedIcon from "@/shared/assets/icons/Checked.svg?react";
import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import DeliveryIcon from "@/shared/assets/icons/Delivery.svg?react";
import RefundIcon from "@/shared/assets/icons/Refund.svg?react";
import SettingIcon from "@/shared/assets/icons/Setting.svg?react";
import ShippingIcon from "@/shared/assets/icons/Shipping.svg?react";

const STATUS_ICON_MAP: Record<OrderStatusType, FC> = {
    PENDING: CheckedIcon,
    CONFIRMED: CheckedIcon,
    PROCESSING: SettingIcon,
    SHIPPED: ShippingIcon,
    DELIVERED: DeliveryIcon,
    CANCELLED: CloseIcon,
    REFUNDED: RefundIcon,
};

export const resolveOrderStatusIcon = (status: OrderStatusType) =>
    STATUS_ICON_MAP[status] ?? CheckedIcon;

export const resolveOrderStatusTone = (
    currentEvent: OrderTimelineEvent | undefined,
    orderStatus: OrderStatusType,
) => {
    if (orderStatus === "CANCELLED" || orderStatus === "REFUNDED") {
        return "danger";
    }

    if (currentEvent?.status === "DELIVERED" && currentEvent.state === "done") {
        return "success";
    }

    return "primary";
};
