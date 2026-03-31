import {resolveEventProgress} from "@/pages/Order/model/services/resolveEventProgress.ts";

import type {OrderTimelineEvent} from "@/entities/order";

import {i18n} from "@/shared/config";
import type {TimelineEvent} from "@/shared/ui/Timeline";

const resolveEventLabel = (event: OrderTimelineEvent): string => {
    if (event.state === "done") {
        return i18n.t(`order.timeline.done.${event.status.toLowerCase()}`, {ns: "checkout"});
    }

    return i18n.t(`order.timeline.active.${event.status.toLowerCase()}`, {ns: "checkout"});
};

export const mapOrderTimelineToTimelineEvents = (events: OrderTimelineEvent[]): TimelineEvent[] => {
    return events.map((event) => ({
        state: event.state,
        label: resolveEventLabel(event),
        progress: resolveEventProgress(event),
    }));
};
