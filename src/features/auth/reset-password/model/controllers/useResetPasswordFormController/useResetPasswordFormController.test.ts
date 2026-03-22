import {act, renderHook} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, test, vi} from "vitest";

import {useResetPasswordFormController} from "./useResetPasswordFormController";

const testCtx = vi.hoisted(() => ({
    navigateMock: vi.fn(),
    resetPasswordMutationMock: vi.fn(),
    extractApiErrorMessageMock: vi.fn((error: unknown) =>
        error instanceof Error ? error.message : "Request failed",
    ),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("../../../api/resetPasswordApi", () => ({
    useResetPasswordMutation: () => [testCtx.resetPasswordMutationMock, {isLoading: false}],
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (...args: unknown[]) => testCtx.extractApiErrorMessageMock(...args),
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {LOGIN: "login"},
    routePaths: {login: "/:lng/login"},
    i18n: {
        t: (key: string) => key,
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
    isPasswordValid: (password: string) => password.length >= 8 && /\d/.test(password),
    getPasswordRequirementsState: (password: string) => [
        {key: "len", isMet: password.length >= 8},
        {key: "digit", isMet: /\d/.test(password)},
    ],
}));

describe("useResetPasswordFormController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        testCtx.resetPasswordMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("returns hasToken=false when token is missing", () => {
        const {result} = renderHook(() => useResetPasswordFormController(null));

        expect(result.current.status.hasToken).toBe(false);
    });

    test("sets fieldError for invalid password", async () => {
        const {result} = renderHook(() => useResetPasswordFormController("token-1"));

        act(() => {
            result.current.actions.changeNewPassword("short");
        });
        await act(async () => {
            await result.current.actions.submit();
        });

        expect(result.current.status.fieldError).toBeTruthy();
        expect(testCtx.resetPasswordMutationMock).not.toHaveBeenCalled();
    });

    test("submits and redirects to login after countdown", async () => {
        const {result} = renderHook(() => useResetPasswordFormController("token-1"));

        act(() => {
            result.current.actions.changeNewPassword("Strong123!");
        });
        await act(async () => {
            await result.current.actions.submit();
        });

        expect(testCtx.resetPasswordMutationMock).toHaveBeenCalledWith({
            token: "token-1",
            newPassword: "Strong123!",
        });
        expect(result.current.data.isSuccess).toBe(true);

        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/login");
    });
});
