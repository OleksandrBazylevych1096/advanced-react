import {act, renderHook} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {useInitializeEditModeButtonController} from "./useInitializeEditModeButtonController";

const dispatchMock = vi.fn();

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => dispatchMock,
}));

vi.mock("../../slice/saveShippingAddressSlice", () => ({
    saveShippingAddressActions: {
        initializeEditMode: (payload: unknown) => ({type: "shipping/initEdit", payload}),
    },
}));

describe("useInitializeEditModeButtonController", () => {
    test("initializes edit mode from address and stops propagation", () => {
        const address = {
            id: "a1",
            streetAddress: "Baker St",
            city: "London",
            numberOfApartment: "12A",
            zipCode: "NW1",
            latitude: 51.5,
            longitude: -0.09,
        };
        const event = {stopPropagation: vi.fn()} as unknown as React.MouseEvent<HTMLButtonElement>;

        const {result} = renderHook(() => useInitializeEditModeButtonController(address as never));

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
                    numberOfApartment: "12A",
                    zipCode: "NW1",
                },
                location: [51.5, -0.09],
            },
        });
    });
});
