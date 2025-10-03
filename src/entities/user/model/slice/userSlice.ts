import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { LOCAL_STORAGE_USER_KEY, type CurrencyType } from "@/shared/config";

import type { User, UserSchema } from "../types/UserSchema";

const initialState: UserSchema = {
  userData: undefined,
  currency: "USD",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = undefined;
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

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
