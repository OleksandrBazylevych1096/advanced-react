import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import {LOCAL_STORAGE_USER_KEY} from "@/shared/config";
import type {CurrencyType} from "@/shared/config";

import type {User, UserSchema} from "../types/UserSchema";

const initialState: UserSchema = {
    userData: undefined,
    currency: "USD",
    accessToken: undefined,
    accessTokenExpiresAt: undefined,
    isSessionReady: false,
    pendingMfaChallenge: undefined,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User>) => {
            state.userData = action.payload;
        },
        setAccessToken: (
            state,
            action: PayloadAction<{accessToken: string; accessTokenExpiresAt: string}>,
        ) => {
            state.accessToken = action.payload.accessToken;
            state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
        },
        setPendingMfaChallenge: (
            state,
            action: PayloadAction<NonNullable<UserSchema["pendingMfaChallenge"]>>,
        ) => {
            state.pendingMfaChallenge = action.payload;
        },
        clearPendingMfaChallenge: (state) => {
            state.pendingMfaChallenge = undefined;
        },
        clearAccessToken: (state) => {
            state.accessToken = undefined;
            state.accessTokenExpiresAt = undefined;
        },
        clearUserData: (state) => {
            state.userData = undefined;
            state.accessToken = undefined;
            state.accessTokenExpiresAt = undefined;
            state.pendingMfaChallenge = undefined;
        },
        setSessionReady: (state) => {
            state.isSessionReady = true;
        },
        setCurrency: (state, action: PayloadAction<CurrencyType>) => {
            state.currency = action.payload;
        },
        initUserData: (state) => {
            const user = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
            if (user) {
                try {
                    state.userData = JSON.parse(user);
                } catch (error) {
                    console.log(error);
                }
            }
        },
    },
});

export const {actions: userActions} = userSlice;
export const {reducer: userReducer} = userSlice;
