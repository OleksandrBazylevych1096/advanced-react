import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {createControllerResult} from "@/shared/lib/state/controllerResult";

import {selectToastNotifications} from "../selectors/selectToastNotifications";
import {toastActions} from "../slice/toastSlice";

export const useToastNotificationListController = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectToastNotifications);

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
