import {describe, expect, test, vi} from "vitest";

import {mapOrderTimelineToTimelineEvents} from "./mapOrderTimelineToTimelineEvents";

const testCtx = vi.hoisted(() => ({
    resolveEventProgressMock: vi.fn(),
    translateMock: vi.fn(),
}));

vi.mock("@/pages/Order/model/services/resolveEventProgress.ts", () => ({
    resolveEventProgress: (...args: unknown[]) => testCtx.resolveEventProgressMock(...args),
}));

vi.mock("@/shared/config", () => ({
    i18n: {
        t: (...args: unknown[]) => testCtx.translateMock(...args),
    },
}));

describe("mapOrderTimelineToTimelineEvents", () => {
    test("maps done and active events to translated timeline items", () => {
        testCtx.resolveEventProgressMock.mockReturnValueOnce(100).mockReturnValueOnce(45);
        testCtx.translateMock.mockReturnValueOnce("Confirmed").mockReturnValueOnce("Processing");

        const result = mapOrderTimelineToTimelineEvents([
            {
                status: "CONFIRMED",
                state: "done",
                startedAt: "2026-03-24T00:30:00.000Z",
                plannedEndAt: "2026-03-24T01:30:00.000Z",
            },
            {
                status: "PROCESSING",
                state: "active",
                startedAt: "2026-03-24T01:30:00.000Z",
                plannedEndAt: "2026-03-24T05:30:00.000Z",
            },
        ]);

        expect(testCtx.translateMock).toHaveBeenNthCalledWith(1, "order.timeline.done.confirmed", {
            ns: "checkout",
        });
        expect(testCtx.translateMock).toHaveBeenNthCalledWith(
            2,
            "order.timeline.active.processing",
            {ns: "checkout"},
        );
        expect(result).toEqual([
            {
                state: "done",
                label: "Confirmed",
                progress: 100,
            },
            {
                state: "active",
                label: "Processing",
                progress: 45,
            },
        ]);
    });
});
