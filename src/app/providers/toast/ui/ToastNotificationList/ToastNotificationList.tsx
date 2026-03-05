import {useToastNotificationListController} from "../../model/controllers/useToastNotificationListController";
import {ToastNotificationListItem} from "../ToastNotificationListItem/ToastNotificationListItem";
import {Stack} from "@/shared/ui";

import styles from "./ToastNotificationList.module.scss";

export const ToastNotificationList = () => {
    const {
        data: {notifications},
        actions: {removeToast},
    } = useToastNotificationListController();

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
