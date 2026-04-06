import {describe, expect, test} from "vitest";

import {resolveEventProgress} from "./resolveEventProgress";

describe("resolveEventProgress", () => {
    test("returns the progress value from the event", () => {
        expect(
            resolveEventProgress({
                id: "order_placed",
                status: "ORDER_PLACED",
                timestamp: "2026-03-24T00:00:00.000Z",
                progress: 100,
            }),
        ).toBe(100);
    });

    test("returns 0 for upcoming events", () => {
        expect(
            resolveEventProgress({
                id: "delivered",
                status: "DELIVERED",
                timestamp: null,
                progress: 0,
            }),
        ).toBe(0);
    });

    test("returns partial progress for current step", () => {
        expect(
            resolveEventProgress({
                id: "processing",
                status: "PROCESSING",
                timestamp: "2026-03-24T02:00:00.000Z",
                progress: 15,
            }),
        ).toBe(15);
    });

    test("returns time-based progress for shipped step", () => {
        expect(
            resolveEventProgress({
                id: "shipped",
                status: "SHIPPED",
                timestamp: "2026-03-24T03:00:00.000Z",
                progress: 45,
            }),
        ).toBe(45);
    });
});
