import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useSelectDefaultShippingAddressController} from "./useSelectDefaultShippingAddressController";

const setDefaultMock = vi.fn();

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

vi.mock("../../api/selectDefaultShippingAddressApi", () => ({
    useSetDefaultShippingAddressMutation: () => [setDefaultMock],
}));

describe("useSelectDefaultShippingAddressController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("calls mutation only for non-default address", async () => {
        const event = {stopPropagation: vi.fn()} as unknown as React.MouseEvent<HTMLDivElement>;
        const {result} = renderHook(() => useSelectDefaultShippingAddressController());

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
