import {act, renderHook} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {useProductFiltersControlsController} from "./useProductFiltersControlsController";

const dispatchMock = vi.fn();

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => dispatchMock,
}));

vi.mock("@/features/product-filters", () => ({
    productFiltersActions: {
        toggleIsOpen: () => ({type: "filters/toggleIsOpen"}),
    },
}));

describe("useProductFiltersControlsController", () => {
    test("toggles filters sidebar", () => {
        const {result} = renderHook(() => useProductFiltersControlsController());

        act(() => {
            result.current.actions.toggleProductFilters();
        });

        expect(dispatchMock).toHaveBeenCalledWith({type: "filters/toggleIsOpen"});
    });
});
