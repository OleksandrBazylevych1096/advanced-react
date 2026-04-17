import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

import {useSettingsUpdateEmailNotificationsMutation} from "@/pages/settings/Notifications/api/updateEmailNotificationsApi";

import {selectUserData, userActions} from "@/entities/user";

import {extractApiErrorMessage} from "@/shared/lib/errors";
import {useToast} from "@/shared/lib/notifications";
import {useAppDispatch, useAppSelector} from "@/shared/lib/state";
import {Box} from "@/shared/ui/Box";
import {Checkbox} from "@/shared/ui/Checkbox";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./SettingsNotificationsPage.module.scss";

const SettingsNotificationsPage = () => {
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);
    const {error: showErrorToast, success: showSuccessToast} = useToast();

    const [updateEmailNotifications, {isLoading}] = useSettingsUpdateEmailNotificationsMutation();
    const [isEmailNotificationsEnabled, setIsEmailNotificationsEnabled] = useState(
        userData?.emailNotificationsEnabled !== false,
    );

    useEffect(() => {
        setIsEmailNotificationsEnabled(userData?.emailNotificationsEnabled !== false);
    }, [userData?.emailNotificationsEnabled]);

    const handleEmailNotificationsChange = async (enabled: boolean) => {
        const previous = isEmailNotificationsEnabled;
        setIsEmailNotificationsEnabled(enabled);

        try {
            const response = await updateEmailNotifications({enabled}).unwrap();
            const resolvedValue = response.emailNotificationsEnabled;

            setIsEmailNotificationsEnabled(resolvedValue);
            if (userData) {
                dispatch(
                    userActions.setUserData({
                        ...userData,
                        emailNotificationsEnabled: resolvedValue,
                    }),
                );
            }
            showSuccessToast(t("settings.pages.notifications.updated"));
        } catch (requestError) {
            setIsEmailNotificationsEnabled(previous);
            showErrorToast(extractApiErrorMessage(requestError) || t("common.errorDefault"));
        }
    };

    return (
        <Stack className={styles.page} gap={16} data-testid="settings-notifications-page">
            <Typography as="h2" variant="heading" weight="semibold">
                {t("settings.pages.notifications.title")}
            </Typography>
            <Box p={24} className={styles.card}>
                <Stack direction="row" align="center" justify="space-between" gap={16}>
                    <Stack gap={4}>
                        <Typography weight="medium">
                            {t("settings.pages.notifications.emailLabel")}
                        </Typography>
                        <Typography variant="bodySm" tone="muted">
                            {t("settings.pages.notifications.emailDescription")}
                        </Typography>
                    </Stack>
                    <Checkbox
                        checked={isEmailNotificationsEnabled}
                        onChange={(enabled) => void handleEmailNotificationsChange(enabled)}
                        disabled={isLoading || !userData}
                        data-testid="email-notifications-checkbox"
                    />
                </Stack>
            </Box>
        </Stack>
    );
};

export default SettingsNotificationsPage;
