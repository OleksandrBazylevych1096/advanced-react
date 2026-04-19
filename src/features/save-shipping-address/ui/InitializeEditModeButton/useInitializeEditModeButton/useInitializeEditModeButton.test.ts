import {act, renderHook} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {useInitializeEditModeButton} from "./useInitializeEditModeButton.ts";

const dispatchMock = vi.fn();

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => dispatchMock,
}));

vi.mock("../../../model/slice/saveShippingAddressSlice.ts", () => ({
    saveShippingAddressActions: {
        initializeEditMode: (payload: unknown) => ({type: "shipping/initEdit", payload}),
    },
}));

describe("useInitializeEditModeButton", () => {
    test("initializes edit mode from address and stops propagation", () => {
        const address = {
            id: "a1",
            streetAddress: "Baker St",
            city: "London",
            country: "GB",
            numberOfApartment: "12A",
            zipCode: "NW1",
            latitude: 51.5,
            longitude: -0.09,
        };
        const event = {stopPropagation: vi.fn()} as unknown as React.MouseEvent<HTMLButtonElement>;

        const {result} = renderHook(() => useInitializeEditModeButton(address as never));

        act(() => {
            result.current.actions.startEdit(event);
        });

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "shipping/initEdit",
            payload: {
                id: "a1",
                form: {
                    streetAddress: "Baker St",
                    city: "London",
                    country: "GB",
                    numberOfApartment: "12A",
                    zipCode: "NW1",
                },
                location: [51.5, -0.09],
            },
        });
    });
});
