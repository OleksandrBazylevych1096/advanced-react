import {useCallback} from "react";

import {selectUserData, useLogoutMutation} from "@/entities/user";

import {createControllerResult, useAppSelector} from "@/shared/lib";

export const useHeaderController = () => {
    const [logoutRequest] = useLogoutMutation();
    const user = useAppSelector(selectUserData);

    const logoutUser = useCallback(() => {
        void logoutRequest();
    }, [logoutRequest]);

    return createControllerResult({
        data: {
            user,
        },
        actions: {
            logout: logoutUser,
        },
    });
};
