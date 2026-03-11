import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useUnlinkGoogleController} from "./useUnlinkGoogleController";

const testCtx = vi.hoisted(() => ({
    unlinkGoogleMutationMock: vi.fn(),
    extractApiErrorMessageMock: vi.fn(() => "Request failed"),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

vi.mock("@/shared/api", () => ({
    extractApiErrorMessage: (...args: unknown[]) => testCtx.extractApiErrorMessageMock(...args),
}));

vi.mock("../../api/unlinkGoogleApi", () => ({
    useUnlinkGoogleMutation: () => [testCtx.unlinkGoogleMutationMock, {isLoading: false, isSuccess: false}],
}));

describe("useUnlinkGoogleController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.unlinkGoogleMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
    });

    test("unlink calls api mutation", async () => {
        const {result} = renderHook(() => useUnlinkGoogleController());

        await act(async () => {
            await result.current.actions.unlink();
        });

        expect(testCtx.unlinkGoogleMutationMock).toHaveBeenCalledTimes(1);
        expect(result.current.status.error).toBeUndefined();
    });

    test("unlink stores extracted api error", async () => {
        testCtx.extractApiErrorMessageMock.mockReturnValue("Unlink failed");
        testCtx.unlinkGoogleMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("boom")),
        });
        const {result} = renderHook(() => useUnlinkGoogleController());

        await act(async () => {
            await result.current.actions.unlink();
        });

        expect(result.current.status.error).toBe("Unlink failed");
    });
});

