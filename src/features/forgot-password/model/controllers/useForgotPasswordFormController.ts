import {useState} from "react";

import {extractApiErrorMessage} from "@/shared/api";
import {i18n} from "@/shared/config";
import {createControllerResult} from "@/shared/lib";

import {useForgotPasswordMutation} from "../../api/forgotPasswordApi";

import {forgotPasswordSchema} from "./forgotPasswordSchema";

export const useForgotPasswordFormController = () => {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [fieldError, setFieldError] = useState<string | undefined>(undefined);
    const [isSuccess, setIsSuccess] = useState(false);
    const [forgotPassword, forgotPasswordState] = useForgotPasswordMutation();

    const changeIdentifier = (value: string) => {
        setIdentifier(value);
        setError(undefined);
        setFieldError(undefined);
        setIsSuccess(false);
    };

    const submit = async () => {
        setError(undefined);
        setFieldError(undefined);
        setIsSuccess(false);

        const validationResult = forgotPasswordSchema.safeParse({identifier});
        if (!validationResult.success) {
            setFieldError(
                validationResult.error.issues[0]?.message ??
                    i18n.t("auth:forgotPassword.errors.invalidEmail"),
            );
            return;
        }

        try {
            await forgotPassword({identifier}).unwrap();
            setIsSuccess(true);
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return createControllerResult({
        data: {identifier, isSuccess},
        status: {
            isLoading: forgotPasswordState.isLoading,
            error,
            fieldError,
        },
        actions: {changeIdentifier, submit},
    });
};
