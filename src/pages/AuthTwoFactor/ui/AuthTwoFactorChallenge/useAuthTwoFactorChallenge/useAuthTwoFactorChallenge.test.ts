import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useAuthTwoFactorChallenge} from "./useAuthTwoFactorChallenge.ts";

const testCtx = vi.hoisted(() => ({
    pendingChallenge: {
        mfaToken: "mfa-1",
        mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
        availableMethods: ["totp", "otp_email"] as const,
    },
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    verifyTwoFactorMutationMock: vi.fn(),
    sendLoginOtpMutationMock: vi.fn(),
    verifyLoginOtpMutationMock: vi.fn(),
    extractApiErrorMessageMock: vi.fn((_error?: unknown) => "Request failed"),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/entities/user", () => ({
    selectPendingMfaChallenge: () => testCtx.pendingChallenge,
    userActions: {
        clearPendingMfaChallenge: () => ({type: "user/clearPendingMfaChallenge"}),
    },
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {HOME: "home", LOGIN: "login"},
    routePaths: {home: "/:lng", login: "/:lng/login"},
    i18n: {
        t: () => "expired",
    },
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: unknown) => unknown) => selector({}),
}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (error: unknown) => testCtx.extractApiErrorMessageMock(error),
}));

vi.mock("../../../api/authTwoFactorChallengeApi.ts", () => ({
    useVerifyTwoFactorMutation: () => [testCtx.verifyTwoFactorMutationMock, {isLoading: false}],
    useSendLoginOtpMutation: () => [testCtx.sendLoginOtpMutationMock, {isLoading: false}],
    useVerifyLoginOtpMutation: () => [testCtx.verifyLoginOtpMutationMock, {isLoading: false}],
}));

describe("useAuthTwoFactorChallenge", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.pendingChallenge = {
            mfaToken: "mfa-1",
            mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
            availableMethods: ["totp", "otp_email"],
        };
        testCtx.verifyTwoFactorMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
        testCtx.sendLoginOtpMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
        testCtx.verifyLoginOtpMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
    });

    test("sendOtp sends OTP for otp_email method and marks otp as sent", async () => {
        const {result} = renderHook(() => useAuthTwoFactorChallenge());

        act(() => {
            result.current.actions.changeMethod("otp_email");
        });
        await act(async () => {
            await result.current.actions.sendOtp();
        });

        expect(testCtx.sendLoginOtpMutationMock).toHaveBeenCalledWith({
            purpose: "login_2fa",
            mfaToken: "mfa-1",
            channel: "email",
        });
        expect(result.current.data.otpSent).toBe(true);
    });

    test("submit with totp verifies and redirects home", async () => {
        const {result} = renderHook(() => useAuthTwoFactorChallenge());

        await act(async () => {
            await result.current.actions.submit("123456");
        });

        expect(testCtx.verifyTwoFactorMutationMock).toHaveBeenCalledWith({
            mfaToken: "mfa-1",
            method: "totp",
            code: "123456",
        });
        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "user/clearPendingMfaChallenge",
        });
        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en");
    });

    test("submit with otp method verifies through otp endpoint", async () => {
        const {result} = renderHook(() => useAuthTwoFactorChallenge());

        act(() => {
            result.current.actions.changeMethod("otp_email");
        });
        await act(async () => {
            await result.current.actions.submit("1234");
        });

        expect(testCtx.verifyLoginOtpMutationMock).toHaveBeenCalledWith({
            purpose: "login_2fa",
            mfaToken: "mfa-1",
            channel: "email",
            code: "1234",
        });
    });

    test("sets expired challenge error when mfa token is missing", async () => {
        testCtx.pendingChallenge = {
            mfaToken: "",
            mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
            availableMethods: ["totp", "otp_email"],
        };
        const {result} = renderHook(() => useAuthTwoFactorChallenge());

        await act(async () => {
            await result.current.actions.submit("123456");
        });

        expect(result.current.status.error).toBe("expired");
        expect(testCtx.verifyTwoFactorMutationMock).not.toHaveBeenCalled();
        expect(testCtx.verifyLoginOtpMutationMock).not.toHaveBeenCalled();
    });
});
