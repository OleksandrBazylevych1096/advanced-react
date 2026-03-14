import {act, renderHook, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useChooseDeliveryDateController} from "./useChooseDeliveryDateController";

const testCtx = vi.hoisted(() => ({
    state: undefined as StateSchema | undefined,
    deliverySelectionQueryMock: vi.fn(),
    deliverySlotsQueryMock: vi.fn(),
    defaultAddressQueryMock: vi.fn(),
    setDeliverySlotMock: vi.fn(),
    navigateMock: vi.fn(),
    localizedPathMock: vi.fn((path: string) => path),
    toastErrorMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {
            language: "en",
        },
    }),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/entities/user", () => ({
    selectIsAuthenticated: (state: StateSchema) => Boolean(state.user?.userData),
}));

vi.mock("@/entities/shipping-address", () => ({
    useGetDefaultShippingAddressQuery: (...args: unknown[]) =>
        testCtx.defaultAddressQueryMock(...args),
}));

vi.mock("../../api/chooseDeliveryDateApi", () => ({
    useGetDeliverySelectionQuery: (...args: unknown[]) => testCtx.deliverySelectionQueryMock(...args),
    useGetDeliverySlotsQuery: (...args: unknown[]) => testCtx.deliverySlotsQueryMock(...args),
    useSetDeliverySlotMutation: () => [testCtx.setDeliverySlotMock, {isLoading: false}],
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) => selector(testCtx.state as StateSchema),
    useLocalizedRoutePath: () => testCtx.localizedPathMock,
    useToast: () => ({
        error: testCtx.toastErrorMock,
    }),
}));

describe("useChooseDeliveryDateController", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.state = {
            user: {userData: {id: "u1"}},
        } as StateSchema;

        testCtx.defaultAddressQueryMock.mockReturnValue({
            data: {id: "addr-1"},
            isFetching: false,
            isError: false,
        });

        testCtx.deliverySelectionQueryMock.mockReturnValue({
            data: undefined,
            isFetching: false,
            isError: false,
        });

        testCtx.deliverySlotsQueryMock.mockReturnValue({
            data: {
                availableDates: [
                    {date: "2026-03-12", slots: ["10:00", "12:00"]},
                    {date: "2026-03-13", slots: ["14:00"]},
                ],
            },
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });

        testCtx.setDeliverySlotMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("sets first date when slots loaded", async () => {
        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });
    });

    test("hydrates saved selection from delivery-selection response", async () => {
        testCtx.deliverySelectionQueryMock.mockReturnValue({
            data: {
                deliveryDate: "2026-03-12T00:00:00.000Z",
                deliveryTime: "12:00",
            },
            isFetching: false,
            isError: false,
        });

        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.savedSelection).toEqual({
                date: "2026-03-12",
                time: "12:00",
            });
        });
    });

    test("canApply is false when selection has no changes against saved", async () => {
        testCtx.deliverySelectionQueryMock.mockReturnValue({
            data: {
                deliveryDate: "2026-03-12T00:00:00.000Z",
                deliveryTime: "12:00",
            },
            isFetching: false,
            isError: false,
        });

        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.savedSelection).toEqual({
                date: "2026-03-12",
                time: "12:00",
            });
        });

        expect(result.current.data.selectedDate).toBe("2026-03-12");
        expect(result.current.data.selectedTime).toBe("12:00");
        expect(result.current.data.canApply).toBe(false);

        act(() => {
            result.current.actions.selectDate("2026-03-13");
            result.current.actions.selectTime("14:00");
        });

        expect(result.current.data.canApply).toBe(true);
    });

    test("selectDate resets selected time", async () => {
        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        act(() => {
            result.current.actions.selectTime("10:00");
        });

        expect(result.current.data.selectedTime).toBe("10:00");

        act(() => {
            result.current.actions.selectDate("2026-03-13");
        });

        expect(result.current.data.selectedTime).toBeNull();
    });

    test("keeps selected time when switching to date with same time slot", async () => {
        testCtx.deliverySlotsQueryMock.mockReturnValue({
            data: {
                availableDates: [
                    {date: "2026-03-12", slots: ["10:00", "12:00"]},
                    {date: "2026-03-13", slots: ["10:00", "14:00"]},
                ],
            },
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        });

        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        act(() => {
            result.current.actions.selectTime("10:00");
            result.current.actions.selectDate("2026-03-13");
        });

        expect(result.current.data.selectedDate).toBe("2026-03-13");
        expect(result.current.data.selectedTime).toBe("10:00");
    });

    test("does not save slot on time selection without apply", async () => {
        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        act(() => {
            result.current.actions.selectTime("12:00");
        });

        expect(testCtx.setDeliverySlotMock).not.toHaveBeenCalled();
        expect(result.current.data.isOpen).toBe(true);
    });

    test("saves slot and closes modal on apply", async () => {
        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        act(() => {
            result.current.actions.selectTime("12:00");
        });

        await act(async () => {
            await result.current.actions.applySelection();
        });

        expect(testCtx.setDeliverySlotMock).toHaveBeenCalledWith({
            deliveryDate: "2026-03-12",
            deliveryTime: "12:00",
            addressId: "addr-1",
            locale: "en",
        });
        expect(result.current.data.isOpen).toBe(false);
        expect(result.current.data.savedSelection).toEqual({date: "2026-03-12", time: "12:00"});
    });

    test("shows toast when save fails", async () => {
        testCtx.setDeliverySlotMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("boom")),
        });

        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        act(() => {
            result.current.actions.selectTime("12:00");
        });

        await act(async () => {
            await result.current.actions.applySelection();
        });

        expect(testCtx.toastErrorMock).toHaveBeenCalledWith(
            "Failed to save delivery slot. Please try again.",
        );
    });

    test("navigates guest user to login", () => {
        testCtx.state = {
            user: {userData: undefined},
        } as StateSchema;

        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.navigateToLogin();
        });

        expect(testCtx.navigateMock).toHaveBeenCalledWith("/:lng/login");
    });

    test("cancelSelection reverts pending values to saved selection", async () => {
        const {result} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        act(() => {
            result.current.actions.selectTime("10:00");
        });

        await act(async () => {
            await result.current.actions.applySelection();
        });

        act(() => {
            result.current.actions.openModal();
            result.current.actions.selectDate("2026-03-13");
            result.current.actions.selectTime("14:00");
        });

        act(() => {
            result.current.actions.cancelSelection();
        });

        expect(result.current.data.isOpen).toBe(false);

        act(() => {
            result.current.actions.openModal();
        });

        expect(result.current.data.selectedDate).toBe("2026-03-12");
        expect(result.current.data.selectedTime).toBe("10:00");
    });

    test("keeps selected date during slots loading with temporary empty data", async () => {
        const {result, rerender} = renderHook(() => useChooseDeliveryDateController());

        act(() => {
            result.current.actions.openModal();
        });

        await waitFor(() => {
            expect(result.current.data.selectedDate).toBe("2026-03-12");
        });

        testCtx.deliverySlotsQueryMock.mockReturnValue({
            data: {availableDates: []},
            isFetching: true,
            isError: false,
            refetch: vi.fn(),
        });

        rerender();

        expect(result.current.data.selectedDate).toBe("2026-03-12");
    });

    test("requests saved selection for authenticated user even when modal is closed", () => {
        renderHook(() => useChooseDeliveryDateController());

        expect(testCtx.deliverySelectionQueryMock).toHaveBeenCalledWith({locale: "en"}, {
            skip: false,
        });
    });

    test("skips saved selection query for guest user", () => {
        testCtx.state = {
            user: {userData: undefined},
        } as StateSchema;

        renderHook(() => useChooseDeliveryDateController());

        expect(testCtx.deliverySelectionQueryMock).toHaveBeenCalledWith({locale: "en"}, {
            skip: true,
        });
    });
});
