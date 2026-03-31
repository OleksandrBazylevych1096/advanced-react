import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";

import {resolveEventProgress} from "./resolveEventProgress";

describe("resolveEventProgress", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-03-24T03:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("returns 100 for done events", () => {
        expect(
            resolveEventProgress({
                status: "CONFIRMED",
                state: "done",
                startedAt: "2026-03-24T00:00:00.000Z",
                plannedEndAt: "2026-03-24T01:00:00.000Z",
            }),
        ).toBe(100);
    });

    test("returns 0 for upcoming events", () => {
        expect(
            resolveEventProgress({
                status: "DELIVERED",
                state: "upcoming",
                startedAt: "2026-03-24T00:00:00.000Z",
                plannedEndAt: "2026-03-24T01:00:00.000Z",
            }),
        ).toBe(0);
    });

    test("returns time-based progress for active event", () => {
        const progress = resolveEventProgress({
            status: "PROCESSING",
            state: "active",
            startedAt: "2026-03-24T02:00:00.000Z",
            plannedEndAt: "2026-03-24T06:00:00.000Z",
        });

        expect(progress).toBe(32.5);
    });

    test("returns base progress for invalid dates", () => {
        expect(
            resolveEventProgress({
                status: "PROCESSING",
                state: "active",
                startedAt: null,
                plannedEndAt: "invalid-date",
            }),
        ).toBe(10);
    });

    test("clamps active progress to 100", () => {
        expect(
            resolveEventProgress({
                status: "SHIPPED",
                state: "active",
                startedAt: "2026-03-24T00:00:00.000Z",
                plannedEndAt: "2026-03-24T01:00:00.000Z",
            }),
        ).toBe(100);
    });
});
