import {describe, expect, test} from "vitest";

import {extractApiErrorCode} from "./extractApiErrorCode";

describe("extractApiErrorCode", () => {
    test("returns code from direct api error payload", () => {
        const code = extractApiErrorCode({
            status: 400,
            data: {code: "INVALID_CREDENTIALS", message: "Invalid credentials"},
        });

        expect(code).toBe("INVALID_CREDENTIALS");
    });

    test("returns code from nest-style message envelope", () => {
        const code = extractApiErrorCode({
            status: 400,
            data: {
                message: {
                    code: "TOKEN_EXPIRED",
                    message: "Token expired",
                },
            },
        });

        expect(code).toBe("TOKEN_EXPIRED");
    });

    test("returns code from top-level backend envelope", () => {
        const code = extractApiErrorCode({
            status: 401,
            data: {
                code: "REFRESH_TOKEN_REVOKED",
                message: "Refresh token revoked",
            },
        });

        expect(code).toBe("REFRESH_TOKEN_REVOKED");
    });

    test("returns undefined for non-fetch-base-query error", () => {
        const code = extractApiErrorCode({message: "plain error"});

        expect(code).toBeUndefined();
    });

    test("returns undefined for payloads without recognized code fields", () => {
        const code = extractApiErrorCode({
            status: 500,
            data: {message: "Something went wrong"},
        });

        expect(code).toBeUndefined();
    });
});
