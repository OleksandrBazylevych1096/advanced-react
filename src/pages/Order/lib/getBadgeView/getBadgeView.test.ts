import {describe, expect, test} from "vitest";

import {getBadgeView} from "./getBadgeView";

describe("getBadgeView", () => {
    test("returns success badge for delivered status", () => {
        expect(getBadgeView("DELIVERED")).toEqual({
            label: "order.statusPill.inComplete",
            tone: "success",
            className: "statusPillSuccess",
        });
    });

    test("returns danger badge for cancelled status", () => {
        expect(getBadgeView("CANCELLED")).toEqual({
            label: "order.statusPill.cancelled",
            tone: "danger",
            className: "statusPillDanger",
        });
    });

    test("returns danger badge for refunded status", () => {
        expect(getBadgeView("REFUNDED")).toEqual({
            label: "order.statusPill.refunded",
            tone: "danger",
            className: "statusPillDanger",
        });
    });

    test("returns default badge for in-progress statuses", () => {
        expect(getBadgeView("PROCESSING")).toEqual({
            label: "order.statusPill.inProgress",
            tone: "primary",
            className: "statusPillPrimary",
        });
    });
});
