import {baseAPI} from "@/shared/api";

type UpdateEmailNotificationsArgs = {
    enabled: boolean;
};

type UpdateEmailNotificationsResponse = {
    success: true;
    emailNotificationsEnabled: boolean;
};

export const updateEmailNotificationsApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        settingsUpdateEmailNotifications: build.mutation<
            UpdateEmailNotificationsResponse,
            UpdateEmailNotificationsArgs
        >({
            query: (body) => ({
                url: "/auth/notifications/email",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["UserSession"],
        }),
    }),
});

export const {useSettingsUpdateEmailNotificationsMutation} = updateEmailNotificationsApi;
