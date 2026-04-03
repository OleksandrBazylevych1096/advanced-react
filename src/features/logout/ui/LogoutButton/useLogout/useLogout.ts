import {useCallback} from "react";

import {useLogoutMutation} from "../../../api/logoutApi.ts";

export const useLogout = () => {
    const [logoutRequest, logoutState] = useLogoutMutation();

    const logout = useCallback(() => {
        void logoutRequest();
    }, [logoutRequest]);

    return {
        status: {
            isLoading: logoutState.isLoading,
        },
        actions: {
            logout,
        },
    };
};
