import {describe, expect, test} from "vitest";

import {createCartQuantityEngine} from "./cartQuantityEngine";

describe("cartQuantityEngine", () => {
    test("starts flush only when desired quantity differs from confirmed quantity", () => {
        const engine = createCartQuantityEngine();

        engine.ensureSession("p1", 2, 2);
        expect(engine.startFlush("p1")).toBeNull();

        engine.setDesiredQuantity("p1", 5);
        expect(engine.startFlush("p1")).toBe(5);
        expect(engine.startFlush("p1")).toBeNull();
    });

    test("marks success and clears in-flight state with convergence info", () => {
        const engine = createCartQuantityEngine();

        engine.ensureSession("p1", 1, 3);
        expect(engine.startFlush("p1")).toBe(3);

        expect(engine.markSuccess("p1")).toEqual({hasConverged: true});
        expect(engine.clearInFlight("p1")).toEqual({needsFollowUpFlush: false});
        expect(engine.startFlush("p1")).toBeNull();
    });

    test("rolls back desired quantity to confirmed quantity on failure", () => {
        const engine = createCartQuantityEngine();

        engine.ensureSession("p1", 4, 8);
        expect(engine.startFlush("p1")).toBe(8);

        expect(engine.rollbackToConfirmed("p1")).toEqual({
            didChange: true,
            rollbackQuantity: 4,
        });
        expect(engine.clearInFlight("p1")).toEqual({needsFollowUpFlush: false});
        expect(engine.startFlush("p1")).toBeNull();
    });
});
