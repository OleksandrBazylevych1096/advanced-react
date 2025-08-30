import { createSlice } from "@reduxjs/toolkit";

import { exchangeCode } from "../services/exchangeCode/exchangeCode";
import type { AuthByGoogleSchema } from "../types/authByGoogle";

const initialState: AuthByGoogleSchema = {
  isLoading: false,
  error: undefined,
};

const authByGoogleSlice = createSlice({
  name: "authByGoogle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exchangeCode.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exchangeCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(exchangeCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { actions: authByGoogleActions } = authByGoogleSlice;
export const { reducer: authByGoogleReducer } = authByGoogleSlice;
