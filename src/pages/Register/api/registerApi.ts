import {applyAuthSession, type AuthSessionResponse} from "@/entities/user";

import {baseAPI} from "@/shared/api";

type RegisterArgs = {
    email?: string;
    phone?: string;
    password: string;
};

type RegisterResponse = {
    verificationRequired: "email" | "phone" | null;
};

type SuccessResponse = {success: true};
type RegistrationVerifyOtpPurpose = "registration_phone_verify" | "registration_email_verify";
type RegistrationVerifyOtpArgs = {
    purpose: RegistrationVerifyOtpPurpose;
    identifier: string;
    code: string;
};
type RegistrationSendOtpArgs = {
    purpose: RegistrationVerifyOtpPurpose;
    identifier: string;
};

export const registerApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation<RegisterResponse, RegisterArgs>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),
        sendRegistrationOtp: build.mutation<SuccessResponse, RegistrationSendOtpArgs>({
            query: (body) => ({
                url: "/auth/otp/send",
                method: "POST",
                body,
            }),
        }),
        verifyRegistrationOtp: build.mutation<AuthSessionResponse, RegistrationVerifyOtpArgs>({
            query: (body) => ({
                url: "/auth/otp/verify",
                method: "POST",
                body,
            }),
            invalidatesTags: ["UserSession"],
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    applyAuthSession(data, dispatch);
                } catch {
                    // UI handles error.
                }
            },
        }),
    }),
});

export const {
    useRegisterMutation,
    useSendRegistrationOtpMutation,
    useVerifyRegistrationOtpMutation,
} = registerApi;
