import { createAsyncThunk } from "@reduxjs/toolkit";

import { extractErrorMessage, httpClient } from "@/shared/api";

import { registerActions } from "../slice/registerSlice";
import { FormSteps } from "../types/registerForm";

type RegisterArgs = {
  email?: string;
  phone?: string;
  password: string;
};

export const register = createAsyncThunk<
  void,
  RegisterArgs,
  { rejectValue: string }
>("features/register", async (authData, thunkAPI) => {
  try {
    await httpClient.post("/auth/register", authData);
    thunkAPI.dispatch(registerActions.setStep(FormSteps.VERIFICATION));
  } catch (error) {
    thunkAPI.dispatch(registerActions.setStep(FormSteps.CREDENTIALS));
    return thunkAPI.rejectWithValue(extractErrorMessage(error));
  }
});
