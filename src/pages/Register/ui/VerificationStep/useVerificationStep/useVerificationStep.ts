import {useNavigate} from "react-router";

import {AppRoutes, AuthMethod, routePaths} from "@/shared/config";
import {extractApiErrorMessage} from "@/shared/lib/errors";
import {useLocalizedRoutePath} from "@/shared/lib/routing";

import {
    useSendRegistrationOtpMutation,
    useVerifyRegistrationOtpMutation,
} from "../../../api/registerApi.ts";
import {useRegisterFlow} from "../../../model/registerFlowContext.ts";

import {registerVerificationSchema} from "./registerVerificationSchema.ts";

export const useVerificationStep = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const {form, error, setError, verificationRequired, resetFlow} = useRegisterFlow();
    const [verifyRegistrationOtp, verifyRegistrationOtpState] = useVerifyRegistrationOtpMutation();
    const [sendRegistrationOtp, sendRegistrationOtpState] = useSendRegistrationOtpMutation();

    const email = form.watch("email");
    const phone = form.watch("phone");
    const method = form.watch("method");

    const isPhoneVerification = verificationRequired === "phone" && method === AuthMethod.PHONE;
    const isEmailVerification = verificationRequired === "email" && method === AuthMethod.EMAIL;
    const isRegistrationVerification = isPhoneVerification || isEmailVerification;
    const isLoading = verifyRegistrationOtpState.isLoading || sendRegistrationOtpState.isLoading;

    const submitVerification = async (code: string) => {
        if (!isRegistrationVerification) {
            return;
        }

        setError(undefined);
        form.setValue("code", code, {shouldDirty: true});
        const verifyResult = registerVerificationSchema.safeParse({code});

        if (!verifyResult.success) {
            setError(verifyResult.error.issues[0]?.message ?? "Invalid code");
            return;
        }

        const values = form.getValues();
        const purpose = isEmailVerification
            ? "registration_email_verify"
            : "registration_phone_verify";
        const identifier = isEmailVerification ? values.email : values.phone;
        try {
            await verifyRegistrationOtp({
                purpose,
                identifier,
                code,
            }).unwrap();
            navigate(getLocalizedPath(routePaths[AppRoutes.HOME]));
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    const resendCode = async () => {
        if (!isRegistrationVerification) {
            return;
        }

        setError(undefined);
        const values = form.getValues();
        const purpose = isEmailVerification
            ? "registration_email_verify"
            : "registration_phone_verify";
        const identifier = isEmailVerification ? values.email : values.phone;
        try {
            await sendRegistrationOtp({
                purpose,
                identifier,
            }).unwrap();
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return {
        data: {
            email,
            phone,
            verificationRequired,
        },
        derived: {
            isPhoneVerification,
            isEmailVerification,
        },
        status: {error, isLoading},
        actions: {submitVerification, resendCode, resetFlow},
    };
};
