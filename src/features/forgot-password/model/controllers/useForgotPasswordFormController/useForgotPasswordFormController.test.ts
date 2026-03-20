import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useForgotPasswordFormController} from "./useForgotPasswordFormController";

const testCtx = vi.hoisted(() => ({
    forgotPasswordMutationMock: vi.fn(),
    extractApiErrorMessageMock: vi.fn((error: unknown) =>
        error instanceof Error ? error.message : "Request failed",
    ),
}));

vi.mock("../../../api/forgotPasswordApi", () => ({
    useForgotPasswordMutation: () => [testCtx.forgotPasswordMutationMock, {isLoading: false}],
}));

vi.mock("@/shared/api", () => ({
    extractApiErrorMessage: (...args: unknown[]) => testCtx.extractApiErrorMessageMock(...args),
}));

vi.mock("@/shared/config", () => ({
    i18n: {
        t: (key: string) => key,
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

describe("useForgotPasswordFormController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.forgotPasswordMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
    });

    test("sets fieldError for invalid identifier", async () => {
        const {result} = renderHook(() => useForgotPasswordFormController());

        act(() => {
            result.current.actions.changeIdentifier("not-an-email");
        });
        await act(async () => {
            await result.current.actions.submit();
        });

        expect(result.current.status.fieldError).toBeTruthy();
        expect(testCtx.forgotPasswordMutationMock).not.toHaveBeenCalled();
    });

    test("sets success after successful submit", async () => {
        const {result} = renderHook(() => useForgotPasswordFormController());

        act(() => {
            result.current.actions.changeIdentifier("john@example.com");
        });
        await act(async () => {
            await result.current.actions.submit();
        });

        expect(testCtx.forgotPasswordMutationMock).toHaveBeenCalledWith({
            identifier: "john@example.com",
        });
        expect(result.current.data.isSuccess).toBe(true);
        expect(result.current.status.error).toBeUndefined();
    });

    test("sets normalized error when submit fails", async () => {
        testCtx.forgotPasswordMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("Server down")),
        });

        const {result} = renderHook(() => useForgotPasswordFormController());

        act(() => {
            result.current.actions.changeIdentifier("john@example.com");
        });
        await act(async () => {
            await result.current.actions.submit();
        });

        expect(result.current.status.error).toBe("Server down");
        expect(result.current.data.isSuccess).toBe(false);
    });
});
