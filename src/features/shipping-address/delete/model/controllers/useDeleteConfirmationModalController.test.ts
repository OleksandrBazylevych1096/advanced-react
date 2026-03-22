import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useDeleteConfirmationModalController} from "./useDeleteConfirmationModalController";

const testCtx = vi.hoisted(() => ({
    successMock: vi.fn(),
    deleteMutationMock: vi.fn(),
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
}));

vi.mock("@/shared/lib/notifications", () => ({
    useToast: () => ({success: testCtx.successMock}),
}));

vi.mock("../../api/deleteShippingAddressApi", () => ({
    useDeleteShippingAddressMutation: () => [testCtx.deleteMutationMock],
}));

describe("useDeleteConfirmationModalController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.deleteMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue(undefined),
        });
    });

    test("opens/closes modal and deletes address with success toast", async () => {
        const event = {stopPropagation: vi.fn()} as unknown as React.MouseEvent<HTMLButtonElement>;
        const {result} = renderHook(() => useDeleteConfirmationModalController());

        expect(result.current.data.isDeleteModalOpen).toBe(false);

        act(() => {
            result.current.actions.openDeleteModal(event);
        });
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(result.current.data.isDeleteModalOpen).toBe(true);

        await act(async () => {
            await result.current.actions.deleteAddress(event, {id: "a1"} as never);
        });

        expect(testCtx.deleteMutationMock).toHaveBeenCalledWith({id: "a1"});
        expect(testCtx.successMock).toHaveBeenCalledWith("Address deleted successfully");

        act(() => {
            result.current.actions.closeDeleteModal();
        });
        expect(result.current.data.isDeleteModalOpen).toBe(false);
    });
});
