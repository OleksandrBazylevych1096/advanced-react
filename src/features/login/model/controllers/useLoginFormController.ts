import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router";

import {isAuthSessionResponse, isMfaChallengeResponse, userActions} from "@/entities/user";

import {extractApiErrorCode, extractApiErrorMessage} from "@/shared/api";
import {AppRoutes, AuthMethod, type AuthMethodType, routePaths} from "@/shared/config";
import {createControllerResult, useAppDispatch} from "@/shared/lib";

import {useLoginMutation} from "../../api/loginApi";

import {loginFormSchema, type LoginFormValues} from "./loginFormSchema";

export const useLoginFormController = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [method, setMethod] = useState<AuthMethodType>(AuthMethod.EMAIL);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const [submitErrorCode, setSubmitErrorCode] = useState<string | undefined>(undefined);
    const [loginUser, loginState] = useLoginMutation();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            phone: "",
            password: "",
            method: AuthMethod.EMAIL,
        },
        mode: "onSubmit",
    });

    const email = form.watch("email");
    const phone = form.watch("phone");
    const password = form.watch("password");

    const changeEmail = (value: string) => {
        setSubmitError(undefined);
        setSubmitErrorCode(undefined);
        form.setValue("email", value, {shouldDirty: true});
    };

    const changePhone = (value: string) => {
        setSubmitError(undefined);
        setSubmitErrorCode(undefined);
        form.setValue("phone", value, {shouldDirty: true});
    };

    const changePassword = (value: string) => {
        setSubmitError(undefined);
        setSubmitErrorCode(undefined);
        form.setValue("password", value, {shouldDirty: true});
    };

    const submitLogin = async () => {
        setSubmitError(undefined);
        setSubmitErrorCode(undefined);
        const values = form.getValues();
        try {
            const response = await loginUser({
                identifier:
                    method === AuthMethod.EMAIL ? (values.email ?? "") : (values.phone ?? ""),
                password: values.password,
            }).unwrap();

            if (isMfaChallengeResponse(response)) {
                dispatch(
                    userActions.setPendingMfaChallenge({
                        mfaToken: response.mfaToken,
                        mfaTokenExpiresAt: response.mfaTokenExpiresAt,
                        availableMethods: response.availableMethods,
                    }),
                );
                navigate(routePaths[AppRoutes.AUTH_2FA]);
                return;
            }

            if (isAuthSessionResponse(response)) {
                navigate(routePaths[AppRoutes.HOME]);
                return;
            }
        } catch (error) {
            setSubmitErrorCode(extractApiErrorCode(error));
            setSubmitError(extractApiErrorMessage(error));
        }
    };

    const submitForm = form.handleSubmit(async () => {
        await submitLogin();
    });

    const switchAuthMethod = () => {
        setSubmitError(undefined);
        setSubmitErrorCode(undefined);
        setMethod((prev) => {
            const next = prev === AuthMethod.EMAIL ? AuthMethod.PHONE : AuthMethod.EMAIL;
            form.setValue("method", next, {shouldDirty: true});
            if (next === AuthMethod.EMAIL) {
                form.setValue("phone", "", {shouldDirty: true});
            } else {
                form.setValue("email", "", {shouldDirty: true});
            }
            form.clearErrors();
            return next;
        });
    };

    return createControllerResult({
        data: {
            email,
            phone,
            password,
            method,
            submitErrorCode,
        },
        derived: {
            isEmailNotVerified:
                method === AuthMethod.EMAIL && submitErrorCode === "EMAIL_NOT_VERIFIED",
        },
        status: {
            isLoading: loginState.isLoading,
            error: submitError,
            fieldErrors: form.formState.errors,
        },
        actions: {
            changeEmail,
            changePhone,
            changePassword,
            switchAuthMethod,
            submitForm,
        },
    });
};
