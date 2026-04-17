import {useEffect} from "react";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import DangerIcon from "@/shared/assets/icons/Danger.svg?react";
import ErrorIcon from "@/shared/assets/icons/Error.svg?react";
import InfoIcon from "@/shared/assets/icons/Info.svg?react";
import SuccessIcon from "@/shared/assets/icons/Success.svg?react";
import type {Toast} from "@/shared/lib/notifications";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

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

export const ToastNotificationListItem = (props: ToastNotificationListItemProps) => {
    const {notification, onRemove} = props;

    useEffect(() => {
        if (notification.duration && notification.duration > 0) {
            const timer = setTimeout(onRemove, notification.duration);
            return () => clearTimeout(timer);
        }
    }, [notification.duration, onRemove]);

    const Icon = iconMap[notification.type];

    return (
        <Stack
            className={cn(styles.notification, styles[notification.type])}
            direction="row"
            align="flex-start"
            gap={12}
            data-testid={`toast-notification-${notification.type}`}
        >
            <AppIcon Icon={Icon} className={styles.icon} size={20} />
            <div className={styles.content}>
                <Typography className={styles.message} variant="bodySm">
                    {notification.message}
                </Typography>
            </div>
            <Button className={styles.closeButton} theme="ghost" onClick={onRemove}>
                <AppIcon Icon={CloseIcon} />
            </Button>
        </Stack>
    );
};
