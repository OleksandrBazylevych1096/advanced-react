import type {OrderStatusType} from "@/entities/order";

export const getBadgeView = (status: OrderStatusType) => {
    switch (status) {
        case "DELIVERED":
            return {
                label: "order.statusPill.inComplete",
                tone: "success" as const,
                className: "statusPillSuccess",
            };
        case "CANCELLED":
            return {
                label: "order.statusPill.cancelled",
                tone: "danger" as const,
                className: "statusPillDanger",
            };
        case "REFUNDED":
            return {
                label: "order.statusPill.refunded",
                tone: "danger" as const,
                className: "statusPillDanger",
            };

        default:
            return {
                label: "order.statusPill.inProgress",
                tone: "primary" as const,
                className: "statusPillPrimary",
            };
    }
};
