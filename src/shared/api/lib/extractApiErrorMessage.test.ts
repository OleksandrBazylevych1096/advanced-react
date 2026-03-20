import {describe, expect, test, vi} from "vitest";

import {extractApiErrorMessage} from "./extractApiErrorMessage";

vi.mock("@/shared/config/i18n/i18n", () => ({
    default: {
        t: (key: string) => {
            const dictionary: Record<string, string> = {
                "errors.INVALID_CREDENTIALS": "Invalid credentials (translated)",
                "auth:errors.AUTH_LOCKED": "Auth locked (translated)",
                "errors.unknownError": "Unknown error (translated)",
            };

            return dictionary[key] ?? key;
        },
    },
}));

describe("extractApiErrorMessage", () => {
    test("prefers translated message from errors.<code>", () => {
        const message = extractApiErrorMessage({
            status: 400,
            data: {code: "INVALID_CREDENTIALS", message: "Raw message"},
        });

        expect(message).toBe("Invalid credentials (translated)");
    });

    test("falls back to translated message from auth:errors.<code>", () => {
        const message = extractApiErrorMessage({
            status: 403,
            data: {code: "AUTH_LOCKED"},
        });

        expect(message).toBe("Auth locked (translated)");
    });

    test("returns fetch error string when provided", () => {
        const message = extractApiErrorMessage({
            status: "FETCH_ERROR",
            error: "Network error",
        });

        expect(message).toBe("Network error");
    });

    test("returns nested envelope message string when code translation is unavailable", () => {
        const message = extractApiErrorMessage({
            status: 400,
            data: {message: "Invalid request body"},
        });

        expect(message).toBe("Invalid request body");
    });

    test("returns error.message for plain Error-like objects", () => {
        const message = extractApiErrorMessage({message: "Local error"});

        expect(message).toBe("Local error");
    });

    test("returns translated unknown fallback when nothing matches", () => {
        const message = extractApiErrorMessage({status: 500, data: {}});

        expect(message).toBe("Unknown error (translated)");
    });
});
