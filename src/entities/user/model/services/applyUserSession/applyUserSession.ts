import type {UnknownAction} from "@reduxjs/toolkit";

import {LOCAL_STORAGE_USER_KEY} from "@/shared/config";

import {userActions} from "../../slice/userSlice";
import type {AuthSessionResponse} from "../../types/AuthSession";
import type {User} from "../../types/UserSchema";

export const applyUserSession = (user: User, dispatch: (action: UnknownAction) => unknown) => {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    dispatch(userActions.setUserData(user));
};

export const applyAuthSession = (
    session: AuthSessionResponse,
    dispatch: (action: UnknownAction) => unknown,
) => {
    dispatch(userActions.clearPendingMfaChallenge());
    dispatch(
        userActions.setAccessToken({
            accessToken: session.accessToken,
            accessTokenExpiresAt: session.accessTokenExpiresAt,
        }),
    );
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(session.user));
    dispatch(userActions.setUserData(session.user));
};
