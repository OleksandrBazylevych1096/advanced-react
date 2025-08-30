import { createAsyncThunk } from "@reduxjs/toolkit";

import { applyUserSession, type User } from "@/entities/user";

import { extractErrorMessage, httpClient } from "@/shared/api";

export const exchangeCode = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("features/authByGoogle", async (code, thunkAPI) => {
  try {
    const res = await httpClient.get<User>(`/auth/google/verify?code=${code}`);
    const user = res.data;

    applyUserSession(user, thunkAPI.dispatch);

    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});
