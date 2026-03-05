import {useCallback} from "react";

import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib";

import {selectToastNotifications} from "../selectors/selectToastNotifications/selectToastNotifications";
import {toastActions} from "../slice/toastSlice";

export const useToastNotificationListController = () => {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectToastNotifications);

    const removeToast = useCallback(
        (id: string) => {
            dispatch(toastActions.removeToast(id));
        },
        [dispatch],
    );

    return createControllerResult({
        data: {
            notifications,
        },
        actions: {
            removeToast,
        },
    });
};
