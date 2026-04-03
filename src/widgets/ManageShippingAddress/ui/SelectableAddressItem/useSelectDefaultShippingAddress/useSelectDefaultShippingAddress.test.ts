import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useSelectDefaultShippingAddress} from "./useSelectDefaultShippingAddress.ts";

const setDefaultMock = vi.fn();

vi.mock("@/shared/lib", () => ({}));

vi.mock("../../../api/selectDefaultShippingAddressApi.ts", () => ({
    useSetDefaultShippingAddressMutation: () => [setDefaultMock],
}));

describe("useSelectDefaultShippingAddress", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("calls mutation only for non-default address", async () => {
        const event = {stopPropagation: vi.fn()} as unknown as React.MouseEvent<HTMLDivElement>;
        const {result} = renderHook(() => useSelectDefaultShippingAddress());

        await act(async () => {
            await result.current.actions.selectDefaultAddress(event, {
                id: "a1",
                isDefault: false,
            } as never);
        });

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(setDefaultMock).toHaveBeenCalledWith({id: "a1"});

        await act(async () => {
            await result.current.actions.selectDefaultAddress(event, {
                id: "a2",
                isDefault: true,
            } as never);
        });

        expect(setDefaultMock).toHaveBeenCalledTimes(1);
    });
});
