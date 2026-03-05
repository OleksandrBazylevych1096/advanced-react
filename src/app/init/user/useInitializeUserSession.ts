import {useEffect} from "react";

import {userActions, useRefreshSessionMutation} from "@/entities/user";

import {LOCAL_STORAGE_USER_KEY} from "@/shared/config";
import {useAppDispatch} from "@/shared/lib";

export const useInitializeUserSession = () => {
    const dispatch = useAppDispatch();
    const [refreshSession] = useRefreshSessionMutation();

    useEffect(() => {
        dispatch(userActions.initUserData());

        if (localStorage.getItem(LOCAL_STORAGE_USER_KEY)) {
            void refreshSession();
        }
    }, [dispatch, refreshSession]);
};
