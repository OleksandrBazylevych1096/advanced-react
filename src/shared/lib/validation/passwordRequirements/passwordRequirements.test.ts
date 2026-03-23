import {describe, expect, it} from "vitest";

import {
    getPasswordRequirementsState,
    isPasswordValid,
    passwordRequirements,
} from "./passwordRequirements.ts";

const CYRILLIC_PASSWORD = "Пароль";

const byKey = (password: string): Record<string, boolean> =>
    Object.fromEntries(
        getPasswordRequirementsState(password).map((requirement) => [
            requirement.key,
            requirement.isMet,
        ]),
    );

describe("passwordRequirements", () => {
    it("should return one state entry per requirement key", () => {
        const state = getPasswordRequirementsState("Password1!");
        expect(state).toHaveLength(passwordRequirements.length);
        expect(state.map((item) => item.key)).toEqual(passwordRequirements.map((item) => item.key));
    });

    it("should fail all optional requirements for empty password", () => {
        const result = byKey("");
        expect(result).toEqual({
            "register.password.requirements.minLength": false,
            "register.password.requirements.uppercase": false,
            "register.password.requirements.lowercase": false,
            "register.password.requirements.number": false,
            "register.password.requirements.special": false,
        });
    });

    it("should enforce minimum length of 8", () => {
        expect(byKey("Aa1!aaa")["register.password.requirements.minLength"]).toBe(false);
        expect(byKey("Aa1!aaaa")["register.password.requirements.minLength"]).toBe(true);
    });

    it("should detect uppercase for latin and cyrillic scripts", () => {
        expect(byKey("Password1!")["register.password.requirements.uppercase"]).toBe(true);
        expect(byKey(`${CYRILLIC_PASSWORD}1!`)["register.password.requirements.uppercase"]).toBe(
            true,
        );
        expect(byKey("password1!")["register.password.requirements.uppercase"]).toBe(false);
    });

    it("should detect lowercase for latin and cyrillic scripts", () => {
        expect(byKey("password1!")["register.password.requirements.lowercase"]).toBe(true);
        expect(byKey(`${CYRILLIC_PASSWORD}1!`)["register.password.requirements.lowercase"]).toBe(
            true,
        );
        expect(byKey("PASSWORD1!")["register.password.requirements.lowercase"]).toBe(false);
    });

    it("should treat ascii digits as numbers", () => {
        expect(byKey("Password1!")["register.password.requirements.number"]).toBe(true);
        expect(byKey("Password!")["register.password.requirements.number"]).toBe(false);
    });

    it("should not treat letters or digits as special symbols", () => {
        expect(byKey("Password123")["register.password.requirements.special"]).toBe(false);
        expect(byKey(`${CYRILLIC_PASSWORD}123`)["register.password.requirements.special"]).toBe(
            false,
        );
    });

    it("should treat punctuation, whitespace and emoji as special symbols", () => {
        expect(byKey("Password1!")["register.password.requirements.special"]).toBe(true);
        expect(byKey("Password1 ")["register.password.requirements.special"]).toBe(true);
        expect(byKey("Password1\u{1F525}")["register.password.requirements.special"]).toBe(true);
    });

    it("should validate a fully compliant latin password", () => {
        expect(isPasswordValid("Password1!")).toBe(true);
    });

    it("should validate a fully compliant cyrillic password", () => {
        expect(isPasswordValid(`${CYRILLIC_PASSWORD}1!`)).toBe(true);
    });

    it("should reject password missing uppercase", () => {
        expect(isPasswordValid("password1!")).toBe(false);
    });

    it("should reject password missing lowercase", () => {
        expect(isPasswordValid("PASSWORD1!")).toBe(false);
    });

    it("should reject password missing number", () => {
        expect(isPasswordValid("Password!")).toBe(false);
    });

    it("should reject password missing special symbol", () => {
        expect(isPasswordValid("Password123")).toBe(false);
    });

    it("should reject password shorter than 8 characters", () => {
        expect(isPasswordValid("Aa1!aaa")).toBe(false);
    });
});
