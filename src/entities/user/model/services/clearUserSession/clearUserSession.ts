import type {UnknownAction} from "@reduxjs/toolkit";

import {LOCAL_STORAGE_USER_KEY} from "@/shared/config";

import {userActions} from "../../slice/userSlice";

export const clearUserSession = (dispatch: (action: UnknownAction) => unknown) => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    dispatch(userActions.clearPendingMfaChallenge());
    dispatch(userActions.clearAccessToken());
    dispatch(userActions.clearUserData());
};
