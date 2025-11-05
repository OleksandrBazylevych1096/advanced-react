import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Toast, ToastSchema } from "../types/toast";

const initialState: ToastSchema = {
  notifications: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      state.notifications.push({
        ...action.payload,
        id,
        duration: action.payload.duration ?? 3000,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllToasts: (state) => {
      state.notifications = [];
    },
  },
});

export const { actions: toastActions } = toastSlice;
export const { reducer: toastReducer } = toastSlice;
