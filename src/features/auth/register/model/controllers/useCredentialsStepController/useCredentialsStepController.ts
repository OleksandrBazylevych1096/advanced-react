import {AuthMethod} from "@/shared/config";
import {createControllerResult} from "@/shared/lib/state";

import {FormSteps} from "../../../config/formSteps";
import {useRegisterFlow} from "../../registerFlowContext";

import {registerCredentialsStepSchema} from "./registerCredentialsStepSchema";

export const useCredentialsStepController = () => {
    const {form, error, setError, goToStep} = useRegisterFlow();

    const method = form.watch("method");
    const email = form.watch("email");
    const phone = form.watch("phone");
    const emailFieldError = form.formState.errors.email?.message;
    const phoneFieldError = form.formState.errors.phone?.message;
    const emailErrorText = typeof emailFieldError === "string" ? emailFieldError : undefined;
    const phoneErrorText = typeof phoneFieldError === "string" ? phoneFieldError : undefined;

    const changeEmail = (value: string) => {
        setError(undefined);
        form.setValue("email", value, {shouldDirty: true});
    };

    const changePhone = (value: string) => {
        setError(undefined);
        form.setValue("phone", value, {shouldDirty: true});
    };

    const switchMethod = () => {
        setError(undefined);
        const next =
            form.getValues("method") === AuthMethod.EMAIL ? AuthMethod.PHONE : AuthMethod.EMAIL;
        form.setValue("method", next, {shouldDirty: true});

        if (next === AuthMethod.EMAIL) {
            form.setValue("phone", "", {shouldDirty: true});
        } else {
            form.setValue("email", "", {shouldDirty: true});
        }

        form.clearErrors(["email", "phone"]);
    };

    const submitCredentials = () => {
        setError(undefined);
        const values = form.getValues();
        const result = registerCredentialsStepSchema.safeParse(values);

        if (!result.success) {
            for (const issue of result.error.issues) {
                const path = issue.path[0];
                if (path === "email" || path === "phone" || path === "method") {
                    form.setError(path, {message: issue.message, type: "manual"});
                }
            }
            return;
        }

        goToStep(FormSteps.PASSWORD);
    };

    return createControllerResult({
        data: {
            method,
            email,
            phone,
        },
        status: {
            error,
            emailErrorText,
            phoneErrorText,
        },
        actions: {
            changeEmail,
            changePhone,
            switchMethod,
            submitCredentials,
        },
    });
};
