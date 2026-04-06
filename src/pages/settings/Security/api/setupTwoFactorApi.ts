import {baseAPI} from "@/shared/api";

type SetupTwoFactorResponse = {
    qrCodeDataUrl: string;
    backupCodes: string[];
};

type EnableTwoFactorArgs = {
    code: string;
};

type SuccessResponse = {success: true};

export const setupTwoFactorApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        settingsSetupTwoFactor: build.mutation<SetupTwoFactorResponse, void>({
            query: () => ({
                url: "/auth/2fa/setup",
                method: "POST",
            }),
        }),
        settingsEnableTwoFactor: build.mutation<SuccessResponse, EnableTwoFactorArgs>({
            query: (body) => ({
                url: "/auth/2fa/enable",
                method: "POST",
                body,
            }),
            invalidatesTags: ["UserSession"],
        }),
    }),
});

export const {useSettingsSetupTwoFactorMutation, useSettingsEnableTwoFactorMutation} =
    setupTwoFactorApi;
