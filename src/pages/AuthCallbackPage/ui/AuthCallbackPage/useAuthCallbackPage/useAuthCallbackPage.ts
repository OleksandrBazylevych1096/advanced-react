import {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";

import {type MfaMethod, userActions, useRefreshSessionMutation} from "@/entities/user";

import {PROJECT_ENV, i18n, AppRoutes, routePaths} from "@/shared/config";
import {extractApiErrorMessage} from "@/shared/lib/errors";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {useAppDispatch} from "@/shared/lib/state";

export const useAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
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
        if (PROJECT_ENV !== "storybook") {
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
                navigate(getLocalizedPath(routePaths[AppRoutes.AUTH_2FA]), {replace: true});
                return;
            }

            if (accessToken && accessTokenExpiresAt) {
                void refreshSession(undefined)
                    .unwrap()
                    .then(() => {
                        navigate(getLocalizedPath(routePaths[AppRoutes.HOME]), {replace: true});
                    })
                    .catch((error) => {
                        setCallbackError(extractApiErrorMessage(error));
                    });
                return;
            }

            setCallbackError(i18n.t("auth:oauth.callbackPayloadInvalid"));
        }
    }, [
        getLocalizedPath,
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

    return {
        data: {
            errorParam,
            authError,
            requiresTwoFactor,
        },
        status: {
            isLoading: refreshState.isLoading,
        },
    };
};
