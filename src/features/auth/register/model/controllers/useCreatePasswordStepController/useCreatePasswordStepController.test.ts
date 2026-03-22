import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {FormSteps} from "../../../config/formSteps";

import {useCreatePasswordStepController} from "./useCreatePasswordStepController";

const testCtx = vi.hoisted(() => {
    const formValues = {
        method: "email",
        email: "john@example.com",
        phone: "+380991112233",
        password: "",
    };

    return {
        formValues,
        setErrorMock: vi.fn(),
        goToStepMock: vi.fn(),
        setVerificationRequiredMock: vi.fn(),
        setValueMock: vi.fn(),
        setFieldErrorMock: vi.fn(),
        registerMutationMock: vi.fn(),
        extractApiErrorMessageMock: vi.fn((_error?: unknown) => "Request failed"),
    };
});

vi.mock("@/shared/config", () => ({
    AuthMethod: {
        EMAIL: "email",
        PHONE: "phone",
    },
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
}));

vi.mock("@/shared/lib/errors", () => ({
    extractApiErrorMessage: (error: unknown) => testCtx.extractApiErrorMessageMock(error),
}));

vi.mock("../../registerFlowContext", () => ({
    useRegisterFlow: () => ({
        form: {
            watch: (name: keyof typeof testCtx.formValues) => testCtx.formValues[name],
            getValues: (name?: keyof typeof testCtx.formValues) =>
                name ? testCtx.formValues[name] : {...testCtx.formValues},
            setValue: (
                name: keyof typeof testCtx.formValues,
                value: string,
                options?: {shouldDirty?: boolean},
            ) => {
                testCtx.formValues[name] = value;
                testCtx.setValueMock(name, value, options);
            },
            setError: testCtx.setFieldErrorMock,
            formState: {
                errors: {},
            },
        },
        error: undefined,
        setError: testCtx.setErrorMock,
        goToStep: testCtx.goToStepMock,
        setVerificationRequired: testCtx.setVerificationRequiredMock,
    }),
}));

vi.mock("../../../api/registerApi", () => ({
    useRegisterMutation: () => [testCtx.registerMutationMock, {isLoading: false}],
}));

describe("useCreatePasswordStepController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.formValues.method = "email";
        testCtx.formValues.email = "john@example.com";
        testCtx.formValues.phone = "+380991112233";
        testCtx.formValues.password = "";
        testCtx.registerMutationMock.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({verificationRequired: "email"}),
        });
    });

    test("submitPassword sets field error for invalid password", async () => {
        const {result} = renderHook(() => useCreatePasswordStepController());

        act(() => {
            result.current.actions.changePassword("short");
        });
        await act(async () => {
            await result.current.actions.submitPassword();
        });

        expect(testCtx.setFieldErrorMock).toHaveBeenCalledWith(
            "password",
            expect.objectContaining({type: "manual"}),
        );
        expect(testCtx.registerMutationMock).not.toHaveBeenCalled();
    });

    test("submitPassword sends register request and goes to verification", async () => {
        const {result} = renderHook(() => useCreatePasswordStepController());

        act(() => {
            result.current.actions.changePassword("Strong123!");
        });
        await act(async () => {
            await result.current.actions.submitPassword();
        });

        expect(testCtx.registerMutationMock).toHaveBeenCalledWith({
            email: "john@example.com",
            phone: undefined,
            password: "Strong123!",
        });
        expect(testCtx.setVerificationRequiredMock).toHaveBeenCalledWith("email");
        expect(testCtx.goToStepMock).toHaveBeenCalledWith(FormSteps.VERIFICATION);
    });

    test("submitPassword stores extracted api error on failure", async () => {
        testCtx.extractApiErrorMessageMock.mockReturnValue("Register failed");
        testCtx.registerMutationMock.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue(new Error("bad request")),
        });
        const {result} = renderHook(() => useCreatePasswordStepController());

        act(() => {
            result.current.actions.changePassword("Strong123!");
        });
        await act(async () => {
            await result.current.actions.submitPassword();
        });

        expect(testCtx.setErrorMock).toHaveBeenLastCalledWith("Register failed");
    });
});
