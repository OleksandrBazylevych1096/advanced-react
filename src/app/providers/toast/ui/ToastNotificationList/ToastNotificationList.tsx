import { useAppDispatch, useAppSelector } from "@/shared/lib";

import { selectToastNotifications } from "../../model/selectors/selectToastNotifications/selectToastNotifications";
import { toastActions } from "../../model/slice/toastSlice";
import { ToastNotificationListItem } from "../ToastNotificationListItem/ToastNotificationListItem";

import styles from "./ToastNotificationList.module.scss";

export const ToastNotificationList = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectToastNotifications);

  const handleRemove = (id: string) => {
    dispatch(toastActions.removeToast(id));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <ToastNotificationListItem
          key={notification.id}
          notification={notification}
          onRemove={() => handleRemove(notification.id)}
        />
      ))}
    </div>
  );
};
