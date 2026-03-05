import {describe, expect, test} from "vitest";

import {createVersionGuard} from "./createVersionGuard";

describe("createVersionGuard", () => {
    test("increments version per key", () => {
        const guard = createVersionGuard();

        expect(guard.next("p1")).toBe(1);
        expect(guard.next("p1")).toBe(2);
        expect(guard.next("p2")).toBe(1);
    });

    test("supports last-write-wins checks", () => {
        const guard = createVersionGuard();

        const stale = guard.next("p1");
        const current = guard.next("p1");

        expect(guard.isCurrent("p1", stale)).toBe(false);
        expect(guard.isCurrent("p1", current)).toBe(true);
    });

    test("clears version state", () => {
        const guard = createVersionGuard();

        const version = guard.next("p1");
        guard.clear("p1");

        expect(guard.isCurrent("p1", version)).toBe(false);
    });
});
