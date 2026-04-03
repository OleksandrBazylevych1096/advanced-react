import {describe, expect, test} from "vitest";

import {
    selectProductSearchIsFocused,
    selectProductSearchIsQueryValid,
    selectProductSearchQuery,
    selectProductSearchShowHistoryDropdown,
    selectProductSearchSubmittedEvent,
} from "./productSearchSelectors";

describe("productSearchSelectors", () => {
    test("returns defaults when reducer is not mounted", () => {
        const state = {} as StateSchema;

        expect(selectProductSearchQuery(state)).toBe("");
        expect(selectProductSearchIsFocused(state)).toBe(false);
        expect(selectProductSearchIsQueryValid(state)).toBe(false);
        expect(selectProductSearchSubmittedEvent(state)).toBeNull();
        expect(selectProductSearchShowHistoryDropdown(state)).toBe(false);
    });

    test("returns values from mounted reducer state", () => {
        const state = {
            productSearch: {
                query: "milk",
                isFocused: true,
                isQueryValid: false,
                submittedEvent: {id: 1, query: "milk"},
                nextEventId: 2,
            },
        } as unknown as StateSchema;

        expect(selectProductSearchQuery(state)).toBe("milk");
        expect(selectProductSearchIsFocused(state)).toBe(true);
        expect(selectProductSearchIsQueryValid(state)).toBe(false);
        expect(selectProductSearchSubmittedEvent(state)).toEqual({id: 1, query: "milk"});
        expect(selectProductSearchShowHistoryDropdown(state)).toBe(true);
    });
});
