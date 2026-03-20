import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useLoginFormController} from "./useLoginFormController";

const testCtx = vi.hoisted(() => {
    const formValues = {
        email: "",
        phone: "",
        password: "",
        method: "email",
    };

    return {
        formValues,
        dispatchMock: vi.fn(),
        navigateMock: vi.fn(),
        loginMutationMock: vi.fn(),
        extractCodeMock: vi.fn(() => "UNKNOWN"),
        extractMessageMock: vi.fn(() => "Unknown error"),
    };
});

vi.mock("react-hook-form", () => ({
    useForm: () => ({
        watch: (name: keyof typeof testCtx.formValues) => testCtx.formValues[name],
        setValue: (name: keyof typeof testCtx.formValues, value: string) => {
            testCtx.formValues[name] = value as never;
        },
        getValues: () => ({...testCtx.formValues}),
        clearErrors: vi.fn(),
        handleSubmit: (cb: () => Promise<void>) => async (e?: unknown) => {
            if (e && typeof e === "object" && "preventDefault" in (e as object)) {
                (e as {preventDefault?: () => void}).preventDefault?.();
            }
            await cb();
        },
        formState: {errors: {}},
    }),
}));

vi.mock("@hookform/resolvers/zod", () => ({
    zodResolver: vi.fn(),
}));

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/entities/user", () => ({
    isMfaChallengeResponse: (value: unknown) =>
        Boolean(value && typeof value === "object" && "requiresTwoFactor" in (value as object)),
    isAuthSessionResponse: (value: unknown) =>
        Boolean(value && typeof value === "object" && "accessToken" in (value as object)),
    userActions: {
        setPendingMfaChallenge: (payload: unknown) => ({type: "user/setPendingMfa", payload}),
    },
}));

vi.mock("@/shared/api", () => ({
    extractApiErrorCode: (error: unknown) => testCtx.extractCodeMock(error),
    extractApiErrorMessage: (error: unknown) => testCtx.extractMessageMock(error),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppDispatch: () => testCtx.dispatchMock,
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

vi.mock("../../../api/loginApi", () => ({
    useLoginMutation: () => [testCtx.loginMutationMock, {isLoading: false}],
}));

describe("useLoginFormController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.formValues.email = "john@example.com";
        testCtx.formValues.phone = "+123456789";
        testCtx.formValues.password = "password";
        testCtx.formValues.method = "email";
    });

    test("dispatches MFA challenge and navigates to auth-2fa route", async () => {
        testCtx.loginMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                requiresTwoFactor: true,
                mfaToken: "mfa-1",
                mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                availableMethods: ["totp"],
            }),
        });

        const {result} = renderHook(() => useLoginFormController());

        await act(async () => {
            await result.current.actions.submitForm();
        });

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "user/setPendingMfa",
            payload: {
                mfaToken: "mfa-1",
                mfaTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                availableMethods: ["totp"],
            },
        });
        expect(testCtx.navigateMock).toHaveBeenCalledWith(expect.stringContaining("two-factor"));
    });

    test("navigates home when auth session response is returned", async () => {
        testCtx.loginMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                accessToken: "token-1",
                accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
                user: {id: "u1", provider: "LOCAL"},
            }),
        });

        const {result} = renderHook(() => useLoginFormController());

        await act(async () => {
            await result.current.actions.submitForm();
        });

        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en");
    });

    test("stores normalized error code and message when login fails", async () => {
        testCtx.extractCodeMock.mockReturnValue("INVALID_CREDENTIALS");
        testCtx.extractMessageMock.mockReturnValue("Invalid credentials");
        testCtx.loginMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("Unauthorized")),
        });

        const {result} = renderHook(() => useLoginFormController());

        await act(async () => {
            await result.current.actions.submitForm();
        });

        expect(result.current.data.submitErrorCode).toBe("INVALID_CREDENTIALS");
        expect(result.current.status.error).toBe("Invalid credentials");
    });
});
