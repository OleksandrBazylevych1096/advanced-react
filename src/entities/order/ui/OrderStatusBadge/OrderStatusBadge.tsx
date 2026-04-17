import {useTranslation} from "react-i18next";

import type {OrderStatusType} from "@/entities/order/model/types/order";

import {Badge} from "@/shared/ui/Badge";
import {Typography} from "@/shared/ui/Typography";

type OrderStatusBadgeTone = "primary" | "success" | "danger";

interface OrderStatusBadgeView {
    labelKey: string;
    tone: OrderStatusBadgeTone;
}

const getOrderStatusBadgeView = (status: OrderStatusType): OrderStatusBadgeView => {
    switch (status) {
        case "DELIVERED":
            return {
                labelKey: "orderStatusBadge.delivered",
                tone: "success",
            };
        case "CANCELLED":
            return {
                labelKey: "orderStatusBadge.cancelled",
                tone: "danger",
            };
        case "REFUNDED":
            return {
                labelKey: "orderStatusBadge.refunded",
                tone: "danger",
            };
        default:
            return {
                labelKey: "orderStatusBadge.inProgress",
                tone: "primary",
            };
    }
};

interface OrderStatusBadgeProps {
    status: OrderStatusType;
}

export const OrderStatusBadge = ({status}: OrderStatusBadgeProps) => {
    const {t} = useTranslation();
    const badgeView = getOrderStatusBadgeView(status);

    return (
        <Badge tone={badgeView.tone} size="lg" data-testid={`order-status-badge-${status.toLowerCase()}`}>
            <Typography as="span" variant="bodySm" weight="medium" tone={badgeView.tone}>
                {t(badgeView.labelKey)}
            </Typography>
        </Badge>
    );
};
