import {ToastNotificationList} from "@/shared/lib/notifications";
import {Portal} from "@/shared/ui/Portal";

export const ToastProvider = () => {
    return (
        <Portal>
            <ToastNotificationList />
        </Portal>
    );
};
