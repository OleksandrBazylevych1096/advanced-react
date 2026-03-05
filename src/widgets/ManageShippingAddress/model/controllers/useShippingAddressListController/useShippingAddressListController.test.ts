import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useShippingAddressListController} from "./useShippingAddressListController";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    queryMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("@/features/save-shipping-address", () => ({
    saveShippingAddressActions: {
        initializeAddMode: (payload: unknown) => ({type: "shipping/initAdd", payload}),
    },
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetShippingAddressesQuery: () => testCtx.queryMock(),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
}));

describe("useShippingAddressListController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.refetchMock = vi.fn();
        testCtx.queryMock.mockReturnValue({
            data: [{id: "a1"}],
            isLoading: false,
            isFetching: false,
            isError: false,
            error: undefined,
            refetch: testCtx.refetchMock,
        });
    });

    test("returns list query state and opens add mode", () => {
        const event = {stopPropagation: vi.fn()} as unknown as React.MouseEvent<HTMLButtonElement>;
        const {result} = renderHook(() => useShippingAddressListController());

        expect(result.current.data.addresses).toEqual([{id: "a1"}]);
        expect(result.current.actions.refetch).toBe(testCtx.refetchMock);

        act(() => {
            result.current.actions.openAddAddress(event);
        });

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "shipping/initAdd",
            payload: {},
        });
    });
});
