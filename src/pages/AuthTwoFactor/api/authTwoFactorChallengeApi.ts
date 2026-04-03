import {applyAuthSession, type AuthSessionResponse, type MfaMethod} from "@/entities/user";

import {baseAPI} from "@/shared/api";

type VerifyTwoFactorArgs = {
    mfaToken: string;
    method: MfaMethod;
    code?: string;
};

type SendLoginOtpArgs = {
    purpose: "login_2fa";
    mfaToken: string;
    channel: "email" | "sms";
};

type VerifyLoginOtpArgs = {
    purpose: "login_2fa";
    mfaToken: string;
    channel: "email" | "sms";
    code: string;
};

type SuccessResponse = {success: true};

export const authTwoFactorChallengeApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        verifyTwoFactor: build.mutation<AuthSessionResponse, VerifyTwoFactorArgs>({
            query: (body) => ({
                url: "/auth/2fa/verify",
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
        sendLoginOtp: build.mutation<SuccessResponse, SendLoginOtpArgs>({
            query: (body) => ({
                url: "/auth/otp/send",
                method: "POST",
                body,
            }),
        }),
        verifyLoginOtp: build.mutation<AuthSessionResponse, VerifyLoginOtpArgs>({
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

export const {useVerifyTwoFactorMutation, useSendLoginOtpMutation, useVerifyLoginOtpMutation} =
    authTwoFactorChallengeApi;
