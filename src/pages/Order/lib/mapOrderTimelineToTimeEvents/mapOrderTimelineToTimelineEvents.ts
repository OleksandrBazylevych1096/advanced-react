import type {OrderStatusType, OrderTimelineEvent} from "@/entities/order";
import {OrderStatus} from "@/entities/order";

import {i18n} from "@/shared/config";
import type {TimelineEvent} from "@/shared/ui/Timeline";

const DISPLAY_STEPS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"] as const;

type DisplayStep = (typeof DISPLAY_STEPS)[number];

const STATUS_TO_DISPLAY_STEP: Record<OrderStatusType, DisplayStep> = {
    PENDING: "ORDER_PLACED",
    CONFIRMED: "ORDER_PLACED",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "ORDER_PLACED",
    REFUNDED: "ORDER_PLACED",
};

const TERMINAL_STATUSES: OrderStatusType[] = [OrderStatus.CANCELLED, OrderStatus.REFUNDED];

const resolveTimelineLabel = (status: string): string => {
    return i18n.t(`order.timeline.${status.toLowerCase()}`, {
        ns: "checkout",
        defaultValue: status,
    });
};

export interface MappedOrderTimeline {
    events: TimelineEvent[];
    currentStatus: OrderStatusType;
    currentLabel: string;
    currentNote?: string;
}

export const mapOrderTimelineToTimelineEvents = (
    orderStatus: OrderStatusType,
    timeline: OrderTimelineEvent[],
): MappedOrderTimeline => {
    const isTerminal = TERMINAL_STATUSES.includes(orderStatus);
    const cancelledIndex = timeline.findIndex(
        (event) => event.status === OrderStatus.CANCELLED && event.progress > 0,
    );

    const events: TimelineEvent[] = timeline.map((event, index) => {
        const isDone =
            event.progress > 0 ||
            (orderStatus === OrderStatus.REFUNDED && event.status === OrderStatus.REFUNDED);
        const isTerminalEvent =
            event.status === OrderStatus.CANCELLED || event.status === OrderStatus.REFUNDED;
        const isAfterCancelled = cancelledIndex !== -1 && index > cancelledIndex;
        const shouldShowCancelledMarker = isAfterCancelled && event.status !== OrderStatus.REFUNDED;
        const isActive = event.status === orderStatus;

        return {
            id: event.id,
            label: resolveTimelineLabel(event.status),
            state: isDone ? "done" : "upcoming",
            progress: event.progress,
            tone: isTerminalEvent && isDone ? "danger" : "default",
            marker: shouldShowCancelledMarker ? "cancelled" : "default",
            note: event.note ?? undefined,
            isActive,
        } satisfies TimelineEvent;
    });

    const currentDisplayStep = STATUS_TO_DISPLAY_STEP[orderStatus];
    const currentStatus = isTerminal ? orderStatus : orderStatus;
    const currentLabel = isTerminal
        ? i18n.t(`order.status.${orderStatus.toLowerCase()}`, {
              ns: "checkout",
              defaultValue: orderStatus,
          })
        : i18n.t(`order.status.${orderStatus.toLowerCase()}`, {
              ns: "checkout",
              defaultValue: currentDisplayStep,
          });

    const currentStepIndex = DISPLAY_STEPS.indexOf(currentDisplayStep);
    const currentSourceEvent =
        timeline.find((event) => event.status === orderStatus) ?? timeline[currentStepIndex];

    return {
        events,
        currentStatus,
        currentLabel,
        currentNote: currentSourceEvent?.note,
    };
};
