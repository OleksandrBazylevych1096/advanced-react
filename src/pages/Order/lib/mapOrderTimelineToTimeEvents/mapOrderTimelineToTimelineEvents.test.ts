import {describe, expect, test, vi} from "vitest";

import {mapOrderTimelineToTimelineEvents} from "./mapOrderTimelineToTimelineEvents";

vi.mock("@/shared/config", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/shared/config")>();

    return {
        ...actual,
        i18n: {
            ...actual.i18n,
            t: (key: string) => key,
        },
    };
});

describe("mapOrderTimelineToTimelineEvents", () => {
    test("CONFIRMED — order placed done with 15% progress", () => {
        const result = mapOrderTimelineToTimelineEvents("CONFIRMED", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 15,
            },
            {id: "processing", status: "PROCESSING", timestamp: null, progress: 0},
            {id: "shipped", status: "SHIPPED", timestamp: null, progress: 0},
            {id: "delivered", status: "DELIVERED", timestamp: null, progress: 0},
        ]);

        expect(result.currentStatus).toBe("CONFIRMED");
        expect(result.events.map((event) => event.state)).toEqual([
            "done",
            "upcoming",
            "upcoming",
            "upcoming",
        ]);
        expect(result.events[0].progress).toBe(15);
    });

    test("PROCESSING — order placed done 100%, processing done with 15% progress", () => {
        const result = mapOrderTimelineToTimelineEvents("PROCESSING", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 100,
            },
            {
                id: "processing",
                status: "PROCESSING",
                timestamp: "2026-03-24T01:20:00.000Z",
                progress: 15,
            },
            {id: "shipped", status: "SHIPPED", timestamp: null, progress: 0},
            {id: "delivered", status: "DELIVERED", timestamp: null, progress: 0},
        ]);

        expect(result.currentStatus).toBe("PROCESSING");
        expect(result.events.map((event) => event.state)).toEqual([
            "done",
            "done",
            "upcoming",
            "upcoming",
        ]);
        expect(result.events[0].progress).toBe(100);
        expect(result.events[1].progress).toBe(15);
    });

    test("SHIPPED — time-based progress on shipped step", () => {
        const result = mapOrderTimelineToTimelineEvents("SHIPPED", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 100,
            },
            {
                id: "processing",
                status: "PROCESSING",
                timestamp: "2026-03-24T01:20:00.000Z",
                progress: 100,
            },
            {id: "shipped", status: "SHIPPED", timestamp: "2026-03-24T02:00:00.000Z", progress: 40},
            {id: "delivered", status: "DELIVERED", timestamp: null, progress: 0},
        ]);

        expect(result.currentStatus).toBe("SHIPPED");
        expect(result.events.map((event) => event.state)).toEqual([
            "done",
            "done",
            "done",
            "upcoming",
        ]);
        expect(result.events[2].progress).toBe(40);
    });

    test("marks every step as done when order is delivered", () => {
        const result = mapOrderTimelineToTimelineEvents("DELIVERED", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 100,
            },
            {
                id: "processing",
                status: "PROCESSING",
                timestamp: "2026-03-24T01:20:00.000Z",
                progress: 100,
            },
            {
                id: "shipped",
                status: "SHIPPED",
                timestamp: "2026-03-24T02:00:00.000Z",
                progress: 100,
            },
            {
                id: "delivered",
                status: "DELIVERED",
                timestamp: "2026-03-24T05:20:00.000Z",
                progress: 100,
            },
        ]);

        expect(result.events.every((event) => event.state === "done")).toBe(true);
        expect(result.events.every((event) => event.progress === 100)).toBe(true);
        expect(result.currentStatus).toBe("DELIVERED");
    });

    test("handles CANCELLED status � terminal steps follow cancelled -> refunded", () => {
        const result = mapOrderTimelineToTimelineEvents("CANCELLED", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 100,
            },
            {
                id: "cancelled",
                status: "CANCELLED",
                timestamp: "2026-03-24T01:20:00.000Z",
                progress: 100,
                note: "Cancelled from ORDER_PLACED",
            },
            {id: "refunded", status: "REFUNDED", timestamp: null, progress: 0},
        ]);

        expect(result.currentStatus).toBe("CANCELLED");
        expect(result.events.map((event) => event.state)).toEqual(["done", "done", "upcoming"]);
        expect(result.currentNote).toBe("Cancelled from ORDER_PLACED");
    });

    test("defaults to 4 events", () => {
        const result = mapOrderTimelineToTimelineEvents("CONFIRMED", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 15,
            },
            {id: "processing", status: "PROCESSING", timestamp: null, progress: 0},
            {id: "shipped", status: "SHIPPED", timestamp: null, progress: 0},
            {id: "delivered", status: "DELIVERED", timestamp: null, progress: 0},
        ]);

        expect(result.events).toHaveLength(4);
    });

    test("includes note from matching timeline event", () => {
        const result = mapOrderTimelineToTimelineEvents("SHIPPED", [
            {
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 100,
            },
            {
                id: "processing",
                status: "PROCESSING",
                timestamp: "2026-03-24T01:20:00.000Z",
                progress: 100,
            },
            {
                id: "shipped",
                status: "SHIPPED",
                timestamp: "2026-03-24T03:00:00.000Z",
                progress: 40,
                note: "Carrier: DHL",
            },
            {id: "delivered", status: "DELIVERED", timestamp: null, progress: 0},
        ]);

        expect(result.currentNote).toBe("Carrier: DHL");
    });
});
