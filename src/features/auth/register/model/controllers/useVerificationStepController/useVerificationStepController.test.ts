import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useVerificationStepController} from "./useVerificationStepController";

const testCtx = vi.hoisted(() => {
    const formValues = {
        method: "email",
        email: "john@example.com",
        phone: "+380991112233",
        code: "",
    };

    return {
        formValues,
        verificationRequired: "email" as "email" | "phone" | null | undefined,
        error: undefined as string | undefined,
        navigateMock: vi.fn(),
        setErrorMock: vi.fn(),
        resetFlowMock: vi.fn(),
        setValueMock: vi.fn(),
        verifyOtpMutationMock: vi.fn(),
        sendOtpMutationMock: vi.fn(),
        extractApiErrorMessageMock: vi.fn(() => "Request failed"),
    };
});

vi.mock("react-router", () => ({
    useNavigate: () => testCtx.navigateMock,
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {LOGIN: "login"},
    routePaths: {login: "/:lng/login"},
    AuthMethod: {
        EMAIL: "email",
        PHONE: "phone",
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
    useLocalizedRoutePath: () => (path: string) => path.replace(":lng", "en"),
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (...args: unknown[]) => testCtx.extractApiErrorMessageMock(...args),
}));

vi.mock("../../registerFlowContext", () => ({
    useRegisterFlow: () => ({
        form: {
            watch: (name: keyof typeof testCtx.formValues) => testCtx.formValues[name],
            getValues: () => ({...testCtx.formValues}),
            setValue: (
                name: keyof typeof testCtx.formValues,
                value: string,
                options?: {shouldDirty?: boolean},
            ) => {
                testCtx.formValues[name] = value;
                testCtx.setValueMock(name, value, options);
            },
        },
        error: testCtx.error,
        setError: testCtx.setErrorMock,
        verificationRequired: testCtx.verificationRequired,
        resetFlow: testCtx.resetFlowMock,
    }),
}));

vi.mock("../../../api/registerApi", () => ({
    useVerifyRegistrationOtpMutation: () => [testCtx.verifyOtpMutationMock, {isLoading: false}],
    useSendRegistrationOtpMutation: () => [testCtx.sendOtpMutationMock, {isLoading: false}],
}));

describe("useVerificationStepController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.formValues.method = "email";
        testCtx.formValues.email = "john@example.com";
        testCtx.formValues.phone = "+380991112233";
        testCtx.formValues.code = "";
        testCtx.verificationRequired = "email";
        testCtx.error = undefined;
        testCtx.verifyOtpMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
        testCtx.sendOtpMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({success: true}),
        });
    });

    test("submitVerification no-ops when verification is not active for selected method", async () => {
        testCtx.verificationRequired = "phone";
        testCtx.formValues.method = "email";
        const {result} = renderHook(() => useVerificationStepController());

        await act(async () => {
            await result.current.actions.submitVerification("1234");
        });

        expect(testCtx.verifyOtpMutationMock).not.toHaveBeenCalled();
    });

    test("submitVerification validates code and does not call verify for invalid code", async () => {
        const {result} = renderHook(() => useVerificationStepController());

        await act(async () => {
            await result.current.actions.submitVerification("12ab");
        });

        expect(testCtx.setErrorMock).toHaveBeenLastCalledWith("Invalid code");
        expect(testCtx.verifyOtpMutationMock).not.toHaveBeenCalled();
    });

    test("submitVerification verifies and navigates to localized login", async () => {
        const {result} = renderHook(() => useVerificationStepController());

        await act(async () => {
            await result.current.actions.submitVerification("1234");
        });

        expect(testCtx.verifyOtpMutationMock).toHaveBeenCalledWith({
            purpose: "registration_email_verify",
            identifier: "john@example.com",
            code: "1234",
        });
        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/login");
    });

    test("resendCode stores extracted api error when request fails", async () => {
        testCtx.extractApiErrorMessageMock.mockReturnValue("Resend failed");
        testCtx.sendOtpMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("request failed")),
        });
        const {result} = renderHook(() => useVerificationStepController());

        await act(async () => {
            await result.current.actions.resendCode();
        });

        expect(testCtx.setErrorMock).toHaveBeenLastCalledWith("Resend failed");
    });
});
