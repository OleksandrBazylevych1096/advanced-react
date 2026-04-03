import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useShippingAddressList} from "./useShippingAddressList.ts";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    queryMock: vi.fn(),
    refetchMock: vi.fn(),
    state: undefined as StateSchema | undefined,
}));

vi.mock("@/features/save-shipping-address", () => ({
    saveShippingAddressActions: {
        initializeAddMode: (payload: unknown) => ({type: "shipping/initAdd", payload}),
    },
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetShippingAddressesQuery: () => testCtx.queryMock(),
}));

vi.mock("@/entities/user", () => ({
    selectUserData: (state: StateSchema) => state.user?.userData,
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

describe("useShippingAddressList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {
            user: {userData: {id: "u1", provider: "LOCAL"}},
        } as unknown as StateSchema;
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
        const {result} = renderHook(() => useShippingAddressList());

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
