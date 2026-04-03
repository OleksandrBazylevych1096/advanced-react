import {act, renderHook} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {useProductFiltersControls} from "./useProductFiltersControls.ts";

const dispatchMock = vi.fn();

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => dispatchMock,
}));

vi.mock("@/features/product-filters", () => ({
    productFiltersActions: {
        toggleIsOpen: () => ({type: "filters/toggleIsOpen"}),
    },
}));

describe("useProductFiltersControls", () => {
    test("toggles filters sidebar", () => {
        const {result} = renderHook(() => useProductFiltersControls());

        act(() => {
            result.current.actions.toggleProductFilters();
        });

        expect(dispatchMock).toHaveBeenCalledWith({type: "filters/toggleIsOpen"});
    });
});
