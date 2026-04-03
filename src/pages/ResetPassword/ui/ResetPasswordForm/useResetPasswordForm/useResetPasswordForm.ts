import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";

import {AppRoutes, i18n, routePaths} from "@/shared/config";
import {extractApiErrorMessage} from "@/shared/lib/errors";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {getPasswordRequirementsState} from "@/shared/lib/validation";

import {useResetPasswordMutation} from "../../../api/resetPasswordApi.ts";

import {resetPasswordSchema} from "./resetPasswordSchema.ts";

const REDIRECT_DELAY_SECONDS = 5;

export const useResetPasswordForm = (token: string | null) => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [fieldError, setFieldError] = useState<string | undefined>(undefined);
    const [isSuccess, setIsSuccess] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(REDIRECT_DELAY_SECONDS);
    const [resetPassword, resetPasswordState] = useResetPasswordMutation();
    const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

    const passwordRequirementsState = getPasswordRequirementsState(newPassword);
    const isPasswordValid = passwordRequirementsState.every((requirement) => requirement.isMet);

    useEffect(() => {
        if (!isSuccess) return;

        timerRef.current = setInterval(() => {
            setRedirectCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [getLocalizedPath, isSuccess, navigate]);

    const changeNewPassword = (value: string) => {
        setNewPassword(value);
        setError(undefined);
        setFieldError(undefined);
    };

    const submit = async () => {
        setError(undefined);
        setFieldError(undefined);

        const validationResult = resetPasswordSchema.safeParse({token: token ?? "", newPassword});
        if (!validationResult.success) {
            const issue = validationResult.error.issues[0];
            if (issue?.path[0] === "newPassword") {
                setFieldError(issue.message);
            } else {
                setError(issue?.message ?? i18n.t("auth:resetPassword.errors.invalidLink"));
            }
            return;
        }

        try {
            await resetPassword({token: token ?? "", newPassword}).unwrap();
            setIsSuccess(true);
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return {
        data: {newPassword, isSuccess, redirectCountdown},
        derived: {
            passwordRequirementsState,
        },
        status: {
            isLoading: resetPasswordState.isLoading,
            error,
            fieldError,
            hasToken: Boolean(token),
            isPasswordValid,
        },
        actions: {changeNewPassword, submit},
    };
};
