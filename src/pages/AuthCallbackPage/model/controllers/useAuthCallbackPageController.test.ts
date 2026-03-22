import {renderHook, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useAuthCallbackPageController} from "./useAuthCallbackPageController";

const testCtx = vi.hoisted(() => ({
    dispatchMock: vi.fn(),
    navigateMock: vi.fn(),
    refreshSessionMock: vi.fn(),
    searchParams: new URLSearchParams(),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
    useSearchParams: () => [testCtx.searchParams, vi.fn()],
}));

vi.mock("@/entities/user", () => ({
    userActions: {
        setPendingMfaChallenge: (payload: unknown) => ({type: "user/setPendingMfa", payload}),
    },
    useRefreshSessionMutation: () => [testCtx.refreshSessionMock, {isLoading: false}],
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (error: unknown) =>
        error instanceof Error ? error.message : "Request failed",
}));

vi.mock("@/shared/config", () => ({
    PROJECT_ENV: "dev",
    AppRoutes: {
        AUTH_2FA: "auth_2fa",
        HOME: "home",
    },
    routePaths: {
        auth_2fa: "/:lng/two-factor",
        home: "/:lng",
    },
    i18n: {
        t: (key: string) => key,
    },
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

describe("useAuthCallbackPageController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.searchParams = new URLSearchParams();
        testCtx.refreshSessionMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({}),
        });
    });

    test("handles 2FA callback payload and navigates to 2FA page", async () => {
        testCtx.searchParams = new URLSearchParams({
            requiresTwoFactor: "true",
            mfaToken: "mfa-1",
            mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
        });
        testCtx.searchParams.append("availableMethods", "totp");

        renderHook(() => useAuthCallbackPageController());

        await waitFor(() => {
            expect(testCtx.dispatchMock).toHaveBeenCalledWith({
                type: "user/setPendingMfa",
                payload: {
                    mfaToken: "mfa-1",
                    mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                    availableMethods: ["totp"],
                },
            });
        });
        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/two-factor", {replace: true});
        expect(testCtx.refreshSessionMock).not.toHaveBeenCalled();
    });

    test("refreshes session and navigates home when tokens are present", async () => {
        testCtx.searchParams = new URLSearchParams({
            accessToken: "token-1",
            accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
        });

        renderHook(() => useAuthCallbackPageController());

        await waitFor(() => {
            expect(testCtx.refreshSessionMock).toHaveBeenCalledWith(undefined);
            expect(testCtx.navigateMock).toHaveBeenCalledWith("/en", {replace: true});
        });
    });

    test("returns invalid payload error when callback params are incomplete", async () => {
        const {result} = renderHook(() => useAuthCallbackPageController());

        await waitFor(() => {
            expect(result.current.data.authError).toBe("auth:oauth.callbackPayloadInvalid");
        });
    });
});
