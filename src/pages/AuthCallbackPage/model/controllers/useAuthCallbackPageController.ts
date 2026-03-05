import {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";

import {type MfaMethod, userActions, useRefreshSessionMutation} from "@/entities/user";

import {extractApiErrorMessage} from "@/shared/api";
import {AppRoutes, i18n, routePaths} from "@/shared/config";
import {createControllerResult, useAppDispatch} from "@/shared/lib";

export const useAuthCallbackPageController = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [callbackError, setCallbackError] = useState<string | undefined>(undefined);

    const errorParam = searchParams.get("error");
    const accessToken = searchParams.get("accessToken");
    const accessTokenExpiresAt = searchParams.get("accessTokenExpiresAt");
    const requiresTwoFactor = searchParams.get("requiresTwoFactor") === "true";
    const mfaToken = searchParams.get("mfaToken");
    const mfaTokenExpiresAt = searchParams.get("mfaTokenExpiresAt") ?? undefined;
    const availableMethods = searchParams.getAll("availableMethods");
    const parsedAvailableMethods = availableMethods.filter((value): value is MfaMethod =>
        ["totp", "otp_email", "otp_sms", "backup_code"].includes(value),
    );

    const [refreshSession, refreshState] = useRefreshSessionMutation();
    const authError =
        callbackError ||
        (refreshState.error ? extractApiErrorMessage(refreshState.error) : undefined);

    const hasStarted = useRef(false);

    useEffect(() => {
        if (import.meta.env.VITE_PROJECT_ENV !== "storybook") {
            if (hasStarted.current || errorParam) return;

            hasStarted.current = true;
            if (requiresTwoFactor && mfaToken) {
                dispatch(
                    userActions.setPendingMfaChallenge({
                        mfaToken,
                        mfaTokenExpiresAt,
                        availableMethods:
                            parsedAvailableMethods.length > 0 ? parsedAvailableMethods : undefined,
                    }),
                );
                navigate(routePaths[AppRoutes.AUTH_2FA], {replace: true});
                return;
            }

            if (accessToken && accessTokenExpiresAt) {
                void refreshSession(undefined)
                    .unwrap()
                    .then(() => {
                        navigate(routePaths[AppRoutes.HOME], {replace: true});
                    })
                    .catch((error) => {
                        setCallbackError(extractApiErrorMessage(error));
                    });
                return;
            }

            setCallbackError(i18n.t("auth:oauth.callbackPayloadInvalid"));
        }
    }, [
        accessToken,
        accessTokenExpiresAt,
        availableMethods,
        parsedAvailableMethods,
        dispatch,
        errorParam,
        mfaToken,
        mfaTokenExpiresAt,
        navigate,
        refreshSession,
        requiresTwoFactor,
    ]);

    return createControllerResult({
        data: {
            errorParam,
            authError,
            requiresTwoFactor,
        },
        status: {
            isLoading: refreshState.isLoading,
        },
    });
};
