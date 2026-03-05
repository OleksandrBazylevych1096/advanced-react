import {baseAPI} from "@/shared/api";

type ForgotPasswordArgs = {
    identifier: string;
};

type SuccessResponse = {
    success: true;
};

export const forgotPasswordApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        forgotPassword: build.mutation<SuccessResponse, ForgotPasswordArgs>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {useForgotPasswordMutation} = forgotPasswordApi;
