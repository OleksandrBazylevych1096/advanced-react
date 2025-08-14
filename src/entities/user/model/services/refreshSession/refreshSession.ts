import { createAsyncThunk } from "@reduxjs/toolkit";

import { httpClient } from "@/shared/api";
import { LOCAL_STORAGE_USER_KEY } from "@/shared/config";

import { userActions } from "../../slice/userSlice";
import type { User } from "../../types/UserSchema";

export const refreshSession = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("user/refreshSession", async (_, thunkApi) => {
  try {
    const res = await httpClient.post<User>("/auth/refresh");
    const user = res.data;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    thunkApi.dispatch(userActions.setUserData(user));
    return;
    // eslint-disable-next-line
  } catch (error) {
    thunkApi.dispatch(userActions.clearUserData());
    return thunkApi.rejectWithValue("refresh error");
  }
});
