import { createAsyncThunk } from "@reduxjs/toolkit";

import { applyUserSession } from "@/entities/user";

import { extractErrorMessage, httpClient } from "@/shared/api";

type LoginArgs = {
  email?: string;
  phone?: string;
  password?: string;
};

export const login = createAsyncThunk<void, LoginArgs, { rejectValue: string }>(
  "features/login",
  async (authData, thunkApi) => {
    try {
      const res = await httpClient.post("/auth/login", authData);
      const user = res.data;

      applyUserSession(user, thunkApi.dispatch);

      return;
    } catch (error) {
      return thunkApi.rejectWithValue(extractErrorMessage(error));
    }
  }
);
