import {useCallback} from "react";

import {createControllerResult} from "@/shared/lib";

import {useLogoutMutation} from "../../api/logoutApi";

export const useLogoutController = () => {
    const [logoutRequest, logoutState] = useLogoutMutation();

    const logout = useCallback(() => {
        void logoutRequest();
    }, [logoutRequest]);

    return createControllerResult({
        status: {
            isLoading: logoutState.isLoading,
        },
        actions: {
            logout,
        },
    });
};
