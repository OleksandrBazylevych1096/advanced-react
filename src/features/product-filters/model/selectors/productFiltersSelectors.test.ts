import {describe, expect, test} from "vitest";

import {DEFAULT_SORT_BY, DEFAULT_SORT_ORDER} from "@/features/product-filters/consts/defaults.ts";

import {selectActiveFilters} from "./productFiltersSelectors";

describe("productFiltersSelectors", () => {
    test("selectActiveFilters returns default sort values when reducer is not mounted", () => {
        const state = {} as StateSchema;

        const result = selectActiveFilters(state);

        expect(result.sortBy).toBe(DEFAULT_SORT_BY);
        expect(result.sortOrder).toBe(DEFAULT_SORT_ORDER);
        expect(result.inStock).toBe(true);
        expect(result.brands).toEqual([]);
        expect(result.countries).toEqual([]);
    });
});
