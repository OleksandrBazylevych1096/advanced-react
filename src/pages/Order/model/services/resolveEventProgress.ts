import type {OrderTimelineEvent} from "@/entities/order";

export const resolveEventProgress = (event: OrderTimelineEvent): number => {
    return event.progress;
};
