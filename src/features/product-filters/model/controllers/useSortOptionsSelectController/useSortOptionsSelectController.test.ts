import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useSortOptionsSelectController} from "./useSortOptionsSelectController";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    sortSettings: {sortBy: "price", sortOrder: "asc"},
    parseSortValueMock: vi.fn(),
    createSortValueMock: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useSelector: () => testCtx.sortSettings,
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
}));

vi.mock("@/features/product-filters", () => ({
    productFiltersActions: {
        setSortBy: (value: string) => ({type: "filters/setSortBy", payload: value}),
        setSortOrder: (value: string) => ({type: "filters/setSortOrder", payload: value}),
    },
}));

vi.mock("@/features/product-filters/consts/sortOptions.ts", () => ({
    SORT_OPTIONS: [{label: "Price", value: "price:asc"}],
}));

vi.mock("@/features/product-filters/lib/sortOptionsHelpers/sortOptionsHelpers.ts", () => ({
    createSortValue: (...args: unknown[]) => testCtx.createSortValueMock(...args),
    parseSortValue: (...args: unknown[]) => testCtx.parseSortValueMock(...args),
}));

vi.mock("@/features/product-filters/model/selectors/productFiltersSelectors.ts", () => ({
    selectSortSettings: vi.fn(),
}));

describe("useSortOptionsSelectController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.createSortValueMock.mockReturnValue("price:asc");
        testCtx.parseSortValueMock.mockReturnValue({sortBy: "rating", sortOrder: "desc"});
    });

    test("returns options/current value and dispatches parsed sort", () => {
        const {result} = renderHook(() => useSortOptionsSelectController());

        expect(result.current.data.currentSortValue).toBe("price:asc");
        expect(result.current.data.options).toEqual([{label: "Price", value: "price:asc"}]);

        act(() => {
            result.current.actions.changeSort("rating:desc" as never);
        });

        expect(testCtx.parseSortValueMock).toHaveBeenCalledWith("rating:desc");
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/setSortBy",
            payload: "rating",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "filters/setSortOrder",
            payload: "desc",
        });
    });

    test("ignores multi-select array value", () => {
        const {result} = renderHook(() => useSortOptionsSelectController());

        act(() => {
            result.current.actions.changeSort(["price:asc"] as never);
        });

        expect(testCtx.parseSortValueMock).not.toHaveBeenCalled();
        expect(testCtx.dispatchMock).not.toHaveBeenCalled();
    });
});
