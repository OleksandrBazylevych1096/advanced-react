import { Portal } from "@/shared/ui";

import { ToastNotificationList } from "./ToastNotificationList/ToastNotificationList";

export const ToastProvider = () => {
  return (
    <Portal>
      <ToastNotificationList />
    </Portal>
  );
};
