import {baseAPI} from "@/shared/api";

type ResetPasswordArgs = {
    token: string;
    newPassword: string;
};

type SuccessResponse = {
    success: true;
};

export const resetPasswordApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        resetPassword: build.mutation<SuccessResponse, ResetPasswordArgs>({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {useResetPasswordMutation} = resetPasswordApi;
