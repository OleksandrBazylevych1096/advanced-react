import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {
    mockUpdateEmailNotificationsDisabledResponse,
    mockUpdateEmailNotificationsEnabledResponse,
} from "./mockData";

const updateEmailNotificationsBase = createHandlers({
    endpoint: `${API_URL}/auth/notifications/email`,
    method: "patch",
    defaultData: mockUpdateEmailNotificationsEnabledResponse,
    errorData: {error: "Failed to update email notifications"},
    errorStatus: 500,
});

export const settingsNotificationsHandlers = {
    updateEmailNotifications: extendHandlers(updateEmailNotificationsBase, {
        disabled: http.patch(`${API_URL}/auth/notifications/email`, () =>
            HttpResponse.json(mockUpdateEmailNotificationsDisabledResponse),
        ),
        enabled: http.patch(`${API_URL}/auth/notifications/email`, () =>
            HttpResponse.json(mockUpdateEmailNotificationsEnabledResponse),
        ),
    }),
};
