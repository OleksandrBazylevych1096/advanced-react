import { createAsyncThunk } from "@reduxjs/toolkit";

import { httpClient } from "@/shared/api";
import { baseAPI } from "@/shared/api/rtk/baseAPI";
import { LOCAL_STORAGE_USER_KEY } from "@/shared/config";

import { userActions } from "../../slice/userSlice";

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await httpClient.post("/auth/logout");
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      dispatch(userActions.clearUserData());
      dispatch(baseAPI.util.invalidateTags(["ShippingAddress"]));
    }
  }
);
