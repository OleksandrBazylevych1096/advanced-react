import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {FormSteps} from "../../../config/formSteps";

import {useCredentialsStepController} from "./useCredentialsStepController";

const testCtx = vi.hoisted(() => {
    const formValues = {
        method: "email",
        email: "",
        phone: "",
    };

    return {
        formValues,
        setErrorMock: vi.fn(),
        goToStepMock: vi.fn(),
        setValueMock: vi.fn(),
        clearErrorsMock: vi.fn(),
        setFieldErrorMock: vi.fn(),
    };
});

vi.mock("@/shared/config", () => ({
    AuthMethod: {
        EMAIL: "email",
        PHONE: "phone",
    },
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
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
            clearErrors: testCtx.clearErrorsMock,
            setError: testCtx.setFieldErrorMock,
            formState: {
                errors: {},
            },
        },
        error: undefined,
        setError: testCtx.setErrorMock,
        goToStep: testCtx.goToStepMock,
    }),
}));

describe("useCredentialsStepController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.formValues.method = "email";
        testCtx.formValues.email = "";
        testCtx.formValues.phone = "";
    });

    test("switchMethod toggles method and clears opposite field", () => {
        const {result} = renderHook(() => useCredentialsStepController());

        act(() => {
            result.current.actions.switchMethod();
        });

        expect(testCtx.formValues.method).toBe("phone");
        expect(testCtx.setValueMock).toHaveBeenCalledWith("email", "", {shouldDirty: true});
        expect(testCtx.clearErrorsMock).toHaveBeenCalledWith(["email", "phone"]);
    });

    test("submitCredentials sets field error for invalid email", () => {
        testCtx.formValues.method = "email";
        testCtx.formValues.email = "bad-email";

        const {result} = renderHook(() => useCredentialsStepController());

        act(() => {
            result.current.actions.submitCredentials();
        });

        expect(testCtx.setFieldErrorMock).toHaveBeenCalledWith(
            "email",
            expect.objectContaining({type: "manual"}),
        );
        expect(testCtx.goToStepMock).not.toHaveBeenCalled();
    });

    test("submitCredentials advances to password step for valid values", () => {
        testCtx.formValues.method = "phone";
        testCtx.formValues.phone = "+380991112233";

        const {result} = renderHook(() => useCredentialsStepController());

        act(() => {
            result.current.actions.submitCredentials();
        });

        expect(testCtx.goToStepMock).toHaveBeenCalledWith(FormSteps.PASSWORD);
    });
});
