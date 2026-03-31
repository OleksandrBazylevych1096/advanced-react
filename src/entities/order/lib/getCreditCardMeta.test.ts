import {describe, expect, test} from "vitest";

import {getCreditCardMeta} from "./getCreditCardMeta";

describe("getCreditCardMeta", () => {
    test("returns configured card meta for known brand", () => {
        const result = getCreditCardMeta("visa");

        expect(result.name).toBe("Visa");
        expect(result.icon).toBeTypeOf("function");
    });

    test("returns fallback meta for unknown brand", () => {
        const result = getCreditCardMeta("unknown-brand");

        expect(result.name).toBe("Credit Card");
        expect(result.icon).toBeTypeOf("function");
    });

    test("returns fallback meta for nullish brand", () => {
        expect(getCreditCardMeta(null).name).toBe("Credit Card");
        expect(getCreditCardMeta(undefined).name).toBe("Credit Card");
    });
});
