import {describe, expect, it} from "vitest";

import {isSupportedLanguage} from "./isSupportedLanguage.ts";

describe("isSupportedLanguage", () => {
    it("should return true when language is in supported list", () => {
        expect(isSupportedLanguage("en")).toBe(true);
    });

    it("should return false when language is not in supported list", () => {
        expect(isSupportedLanguage("fr")).toBe(false);
    });

    it("should return false when language is undefined", () => {
        expect(isSupportedLanguage(undefined)).toBe(false);
    });
});
