import {useState} from "react";
import {useNavigate} from "react-router";

import {DEFAULT_METHODS} from "@/features/auth-two-factor-challenge/config/consts.ts";

import {type MfaMethod, selectPendingMfaChallenge, userActions} from "@/entities/user";

import {extractApiErrorMessage} from "@/shared/api";
import {AppRoutes, i18n, routePaths} from "@/shared/config";
import {
    createControllerResult,
    useAppDispatch,
    useAppSelector,
    useLocalizedRoutePath,
} from "@/shared/lib";

import {
    useSendLoginOtpMutation,
    useVerifyLoginOtpMutation,
    useVerifyTwoFactorMutation,
} from "../../api/authTwoFactorChallengeApi";

export const useAuthTwoFactorChallengeController = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const dispatch = useAppDispatch();
    const pendingMfaChallenge = useAppSelector(selectPendingMfaChallenge);

    const availableMethods = pendingMfaChallenge?.availableMethods ?? DEFAULT_METHODS;

    const [selectedMethod, setSelectedMethod] = useState<MfaMethod>(availableMethods[0]);
    const [backupCode, setBackupCode] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [otpSent, setOtpSent] = useState(false);

    const [verifyTwoFactor, verifyTwoFactorState] = useVerifyTwoFactorMutation();
    const [sendLoginOtp, sendLoginOtpState] = useSendLoginOtpMutation();
    const [verifyLoginOtp, verifyLoginOtpState] = useVerifyLoginOtpMutation();

    const isOtpMethod = selectedMethod === "otp_sms" || selectedMethod === "otp_email";
    const otpChannel = selectedMethod === "otp_email" ? "email" : "sms";

    const onVerifySuccess = () => {
        dispatch(userActions.clearPendingMfaChallenge());
        navigate(getLocalizedPath(routePaths[AppRoutes.HOME]));
    };

    const changeMethod = (value: string) => {
        setSelectedMethod(value as MfaMethod);
        setBackupCode("");
        setError(undefined);
        setOtpSent(false);
    };

    const changeBackupCode = (value: string) => {
        setBackupCode(value);
        setError(undefined);
    };

    const clearError = () => setError(undefined);

    const goToLogin = () => {
        dispatch(userActions.clearPendingMfaChallenge());
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    const ensureChallenge = () => {
        if (!pendingMfaChallenge?.mfaToken) {
            setError(i18n.t("auth:twoFactor.expiredChallenge"));
            return null;
        }
        return pendingMfaChallenge.mfaToken;
    };

    const sendOtp = async () => {
        setError(undefined);

        const mfaToken = ensureChallenge();

        if (!mfaToken) return;
        if (!isOtpMethod) return;

        try {
            await sendLoginOtp({
                purpose: "login_2fa",
                mfaToken,
                channel: otpChannel,
            }).unwrap();
            setOtpSent(true);
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    const submit = async (code?: string) => {
        const mfaToken = ensureChallenge();
        if (!mfaToken) return;

        const finalCode = code ?? backupCode;

        try {
            if (isOtpMethod) {
                await verifyLoginOtp({
                    purpose: "login_2fa",
                    mfaToken,
                    channel: otpChannel,
                    code: finalCode,
                }).unwrap();
            } else {
                await verifyTwoFactor({
                    mfaToken,
                    method: selectedMethod,
                    code: finalCode,
                }).unwrap();
            }
            onVerifySuccess();
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return createControllerResult({
        data: {
            pendingMfaChallenge,
            availableMethods,
            selectedMethod,
            backupCode,
            otpSent,
        },
        derived: {
            isOtpMethod,
        },
        status: {
            error,
            isLoading:
                verifyTwoFactorState.isLoading ||
                sendLoginOtpState.isLoading ||
                verifyLoginOtpState.isLoading,
        },
        actions: {
            changeMethod,
            changeBackupCode,
            clearError,
            sendOtp,
            submit,
            goToLogin,
        },
    });
};
