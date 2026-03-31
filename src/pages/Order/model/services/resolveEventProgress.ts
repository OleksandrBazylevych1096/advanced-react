import type {OrderTimelineEvent} from "@/entities/order";

import {clampValue} from "@/shared/lib/math";

export const resolveEventProgress = (event: OrderTimelineEvent): number => {
    if (event.state === "done") return 100; // 100%
    if (event.state !== "active") return 0; // 0%

    const baseProgress = 10; // active event starts with 10% progress
    const currentPlannedAtMs = new Date(event.plannedEndAt).getTime();
    const startedAtMs = event.startedAt ? new Date(event.startedAt).getTime() : Number.NaN;
    if (Number.isNaN(startedAtMs) || Number.isNaN(currentPlannedAtMs)) return baseProgress;
    if (currentPlannedAtMs <= startedAtMs) return baseProgress;

    const elapsedMs = new Date().getTime() - startedAtMs;
    const totalMs = currentPlannedAtMs - startedAtMs;
    const timeProgress = clampValue((elapsedMs / totalMs) * 100, 0, 100);

    return clampValue(baseProgress + (timeProgress * 90) / 100, 0, 100);
};
