import { useEffect } from "react";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import DangerIcon from "@/shared/assets/icons/Danger.svg?react";
import ErrorIcon from "@/shared/assets/icons/Error.svg?react";
import InfoIcon from "@/shared/assets/icons/Info.svg?react";
import SuccessIcon from "@/shared/assets/icons/Success.svg?react";
import { cn } from "@/shared/lib";
import { AppIcon, Button } from "@/shared/ui";

import type { Toast } from "../../model/types/toast";

import styles from "./ToastNotificationListItem.module.scss";

interface ToastNotificationListItemProps {
  notification: Toast;
  onRemove: () => void;
}

const iconMap = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
  warning: DangerIcon,
};

export const ToastNotificationListItem = (
  props: ToastNotificationListItemProps
) => {
  const { notification, onRemove } = props;

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(onRemove, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, onRemove]);

  const Icon = iconMap[notification.type];

  return (
    <div className={cn(styles.notification, styles[notification.type])}>
      <AppIcon Icon={Icon} className={styles.icon} size={20} />
      <div className={styles.content}>
        <p className={styles.message}>{notification.message}</p>
      </div>
      <Button className={styles.closeButton} theme="ghost" onClick={onRemove}>
        <AppIcon Icon={CloseIcon} />
      </Button>
    </div>
  );
};
