import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import {selectToastNotifications} from "../../state/selectors/selectToastNotifications.ts";
import {toastActions} from "../../state/slice/toastSlice.ts";

export const useToastNotificationList = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectToastNotifications);

    const removeToast = useCallback(
        (id: string) => {
            dispatch(toastActions.removeToast(id));
        },
        [dispatch],
    );

    return {
        data: {
            notifications,
        },
        actions: {
            removeToast,
        },
    };
};
