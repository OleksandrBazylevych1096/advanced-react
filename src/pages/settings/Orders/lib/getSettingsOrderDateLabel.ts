import {type OrderDetails, OrderStatus} from "@/entities/order";

const FALLBACK_ORDER_DATE = "—";

export const getSettingsOrderDateLabel = (locale: string, order: OrderDetails): string => {
    let text = null
    let date = null
    if (order.status === OrderStatus.REFUNDED && order.refundedAt) {
        text = "Refunded at"
        date = new Date(order.refundedAt);

    }

    if (order.status === OrderStatus.CANCELLED && order.cancelledAt) {
        text = "Cancelled at"
        date = new Date(order.cancelledAt)

    }

    if (order.status === OrderStatus.DELIVERED && order.deliveryDate) {
        text = "Delivered at"
        date = new Date(order.deliveryDate)

    }

    if (!date) {
        if (!order.createdAt) return FALLBACK_ORDER_DATE
        text = "Created at"
        date = new Date(order.createdAt)
    }

    if (Number.isNaN(date.getTime())) {
        return FALLBACK_ORDER_DATE;
    }

    const datePart = new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);

    const timePart = new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);

    return `${text} ${datePart}, ${timePart}`;
};

