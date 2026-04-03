import {describe, expect, test} from "vitest";

import {formatDateCard, formatSelectedDateTitle, getDeliveryLabel} from "./formatDate";

describe("formatDate helpers", () => {
    test("formats date card parts", () => {
        const result = formatDateCard("2026-03-24", "en-US");

        expect(result).toEqual({
            weekDay: "Tue",
            monthDay: "03/24",
        });
    });

    test("formats selected date title", () => {
        expect(formatSelectedDateTitle("2026-03-24", "en-US")).toBe("March 24");
    });

    test("builds delivery label from full selection", () => {
        expect(
            getDeliveryLabel(
                "en-US",
                {
                    date: "2026-03-24T18:00:00.000Z",
                    time: "18:00",
                },
                "Choose delivery date",
            ),
        ).toBe("Tue, Mar 24, 18:00");
    });

    test("returns fallback when selection is incomplete", () => {
        expect(
            getDeliveryLabel("en-US", {date: "2026-03-24", time: null}, "Choose delivery date"),
        ).toBe("Choose delivery date");
    });
});
