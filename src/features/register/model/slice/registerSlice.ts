import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { AuthMethod, type AuthMethodType } from "@/shared/config";

import { register } from "../services/register";
import { resendCode } from "../services/resendCode";
import { verifyCode } from "../services/verifyCode";
import {
  FormSteps,
  type FormStepsType,
  type RegisterFormSchema,
} from "../types/registerForm";

const initialState: RegisterFormSchema = {
  email: "",
  phone: "",
  password: "",
  isLoading: false,
  error: undefined,
  method: AuthMethod.EMAIL,
  step: FormSteps.CREDENTIALS,
};

export const registerSlice = createSlice({
  name: "registerForm",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setMethod: (state, action: PayloadAction<AuthMethodType>) => {
      state.method = action.payload;
    },
    setStep: (state, action: PayloadAction<FormStepsType>) => {
      state.step = action.payload;
    },
    resetForm: (state) => {
      state.email = "";
      state.phone = "";
      state.password = "";
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resendCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { actions: registerActions } = registerSlice;
export const { reducer: registerReducer } = registerSlice;
