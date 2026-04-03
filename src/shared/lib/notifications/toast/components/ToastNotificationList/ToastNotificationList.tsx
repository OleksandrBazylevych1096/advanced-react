import {Stack} from "@/shared/ui/Stack";

import {ToastNotificationListItem} from "../ToastNotificationListItem/ToastNotificationListItem";

import styles from "./ToastNotificationList.module.scss";
import {useToastNotificationList} from "./useToastNotificationList.ts";

export const ToastNotificationList = () => {
    const {
        data: {notifications},
        actions: {removeToast},
    } = useToastNotificationList();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <Stack className={styles.container} gap={12}>
            {notifications.map((notification) => (
                <ToastNotificationListItem
                    key={notification.id}
                    notification={notification}
                    onRemove={() => removeToast(notification.id)}
                />
            ))}
        </Stack>
    );
};
