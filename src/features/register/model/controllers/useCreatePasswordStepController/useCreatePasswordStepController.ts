import {extractApiErrorMessage} from "@/shared/api";
import {AuthMethod} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";

import {useRegisterMutation} from "../../../api/registerApi";
import {FormSteps} from "../../../config/formSteps";
import {useRegisterFlow} from "../../registerFlowContext";

import {
    getRegisterPasswordRequirementsState,
    registerPasswordSchema,
} from "./registerPasswordSchema";

export const useCreatePasswordStepController = () => {
    const {form, error, setError, goToStep, setVerificationRequired} = useRegisterFlow();
    const [registerRequest, registerState] = useRegisterMutation();

    const password = form.watch("password");
    const passwordFieldError = form.formState.errors.password?.message;
    const passwordErrorText =
        typeof passwordFieldError === "string" ? passwordFieldError : undefined;
    const passwordRequirementsState = getRegisterPasswordRequirementsState(password);
    const isPasswordValid = passwordRequirementsState.every((requirement) => requirement.isMet);

    const changePassword = (value: string) => {
        setError(undefined);
        form.setValue("password", value, {shouldDirty: true});
    };

    const submitPassword = async () => {
        setError(undefined);
        const passwordResult = registerPasswordSchema.safeParse({
            password: form.getValues("password"),
        });

        if (!passwordResult.success) {
            form.setError("password", {
                message: passwordResult.error.issues[0]?.message ?? "Invalid password",
                type: "manual",
            });
            return;
        }

        const values = form.getValues();
        try {
            const response = await registerRequest({
                email: values.method === AuthMethod.EMAIL ? values.email : undefined,
                phone: values.method === AuthMethod.PHONE ? values.phone : undefined,
                password: values.password,
            }).unwrap();
            setVerificationRequired(response.verificationRequired);
            goToStep(FormSteps.VERIFICATION);
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return createControllerResult({
        data: {
            password,
        },
        derived: {
            passwordRequirementsState,
        },
        status: {
            error,
            isLoading: registerState.isLoading,
            passwordErrorText,
            isPasswordValid,
        },
        actions: {changePassword, submitPassword},
    });
};
