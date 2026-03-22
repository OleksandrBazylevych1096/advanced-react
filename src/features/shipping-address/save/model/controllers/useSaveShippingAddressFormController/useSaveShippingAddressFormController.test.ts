import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import type {DeepPartial} from "@/shared/lib/state";

import {saveShippingAddressActions} from "../../slice/saveShippingAddressSlice";

import {useSaveShippingAddressFormController} from "./useSaveShippingAddressFormController";

const testCtx = vi.hoisted(() => ({
    mockState: undefined as DeepPartial<StateSchema> | undefined,
    dispatchMock: vi.fn(),
    toastErrorMock: vi.fn(),
    createMutationMock: vi.fn(),
    editMutationMock: vi.fn(),
}));

vi.mock("react-i18next", async () => {
    const actual = await vi.importActual<typeof import("react-i18next")>("react-i18next");

    return {
        ...actual,
        useTranslation: () => ({
            i18n: {language: "en"},
        }),
    };
});

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.mockState as StateSchema),
}));

vi.mock("@/shared/lib/async", () => ({
    useDebounce: <T>(value: T) => value,
}));

vi.mock("@/shared/lib/notifications", () => ({
    useToast: () => ({
        error: testCtx.toastErrorMock,
    }),
}));

vi.mock("../../../api/saveShippingAddressApi", () => ({
    useSearchAddressesQuery: vi.fn(() => ({data: []})),
    useCreateShippingAddressMutation: vi.fn(() => [testCtx.createMutationMock, {isLoading: false}]),
    useEditShippingAddressMutation: vi.fn(() => [testCtx.editMutationMock, {isLoading: false}]),
}));

describe("useSaveShippingAddressFormController", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.mockState = {
            saveShippingAddress: {
                mode: "edit",
                editingAddressId: "addr-1",
                form: {
                    city: "London",
                    streetAddress: "Baker Street",
                    numberOfApartment: "221B",
                    zipCode: "NW1",
                },
                location: [51.5237, -0.1585],
            },
        };

        testCtx.createMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({}),
        });
        testCtx.editMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({}),
        });
    });

    test("disables save in edit mode when no values changed", () => {
        const {result} = renderHook(() => useSaveShippingAddressFormController());

        expect(result.current.derived.canSave).toBe(false);
    });

    test("submits edit request and returns to choose mode on success", async () => {
        const {result, rerender} = renderHook(() => useSaveShippingAddressFormController());

        act(() => {
            result.current.actions.changeCity("London City");
        });

        testCtx.mockState = {
            ...testCtx.mockState,
            saveShippingAddress: {
                ...testCtx.mockState!.saveShippingAddress!,
                form: {
                    ...testCtx.mockState!.saveShippingAddress!.form,
                    city: "London City",
                },
            },
        };

        rerender();

        await act(async () => {
            await result.current.actions.submitAddress();
        });

        expect(testCtx.editMutationMock).toHaveBeenCalledWith({
            id: "addr-1",
            body: {
                city: "London City",
                numberOfApartment: "221B",
                streetAddress: "Baker Street",
                zipCode: "NW1",
                latitude: 51.5237,
                longitude: -0.1585,
            },
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith(
            saveShippingAddressActions.returnToChoose(),
        );
    });

    test("shows normalized error message on submit failure", async () => {
        testCtx.editMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {message: "Server validation failed"},
            }),
        });

        const {result, rerender} = renderHook(() => useSaveShippingAddressFormController());

        act(() => {
            result.current.actions.changeZipCode("NW2");
        });

        testCtx.mockState = {
            ...testCtx.mockState,
            saveShippingAddress: {
                ...testCtx.mockState!.saveShippingAddress!,
                form: {
                    ...testCtx.mockState!.saveShippingAddress!.form,
                    zipCode: "NW2",
                },
            },
        };

        rerender();

        await act(async () => {
            await result.current.actions.submitAddress();
        });

        expect(testCtx.toastErrorMock).toHaveBeenCalledWith("Server validation failed");
        expect(testCtx.dispatchMock).not.toHaveBeenCalledWith(
            saveShippingAddressActions.returnToChoose(),
        );
    });
});
