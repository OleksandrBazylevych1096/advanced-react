import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useSortOptionsSelect} from "./useSortOptionsSelect.ts";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    sortSettings: {sortBy: "price", sortOrder: "asc"},
    parseSortValueMock: vi.fn(),
    createSortValueMock: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useSelector: () => testCtx.sortSettings,
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
}));

vi.mock("@/features/product-filters", () => ({
    productFiltersActions: {
        setSortBy: (value: string) => ({type: "productFilters/setSortBy", payload: value}),
        setSortOrder: (value: string) => ({type: "productFilters/setSortOrder", payload: value}),
    },
}));

vi.mock("@/features/product-filters/config/sortOptions.ts", () => ({
    SORT_OPTIONS: [{labelKey: "productFilters.sort.priceAsc", value: "price-asc"}],
}));

vi.mock("@/features/product-filters/lib/sortOptionsHelpers/sortOptionsHelpers.ts", () => ({
    createSortValue: (...args: unknown[]) => testCtx.createSortValueMock(...args),
    parseSortValue: (...args: unknown[]) => testCtx.parseSortValueMock(...args),
}));

vi.mock("@/features/product-filters/model/selectors/productFiltersSelectors.ts", () => ({
    selectSortSettings: vi.fn(),
}));

describe("useSortOptionsSelect", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.createSortValueMock.mockReturnValue("price-asc");
        testCtx.parseSortValueMock.mockReturnValue({sortBy: "rating", sortOrder: "desc"});
    });

    test("returns options/current value and dispatches parsed sort", () => {
        const {result} = renderHook(() => useSortOptionsSelect());

        expect(result.current.data.currentSortValue).toBe("price-asc");
        expect(result.current.data.options).toEqual([
            {label: "productFilters.sort.priceAsc", value: "price-asc"},
        ]);

        act(() => {
            result.current.actions.changeSort("rating-desc" as never);
        });

        expect(testCtx.parseSortValueMock).toHaveBeenCalledWith("rating-desc");
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "productFilters/setSortBy",
            payload: "rating",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "productFilters/setSortOrder",
            payload: "desc",
        });
    });

    test("ignores multi-select array value", () => {
        const {result} = renderHook(() => useSortOptionsSelect());

        act(() => {
            result.current.actions.changeSort(["price-asc"] as never);
        });

        expect(testCtx.parseSortValueMock).not.toHaveBeenCalled();
        expect(testCtx.dispatchMock).not.toHaveBeenCalled();
    });
});
