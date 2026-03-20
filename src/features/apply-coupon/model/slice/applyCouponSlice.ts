import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import type {ApplyCouponSchema} from "../types/applyCouponSchema";

export const applyCouponInitialState: ApplyCouponSchema = {
    code: "",
    draftCode: "",
    message: null,
    isModalOpen: false,
    isApplying: false,
};

export const applyCouponSlice = createSlice({
    name: "applyCoupon",
    initialState: applyCouponInitialState,
    reducers: {
        setCode: (state, action: PayloadAction<string>) => {
            state.code = action.payload;
        },
        setDraftCode: (state, action: PayloadAction<string>) => {
            state.draftCode = action.payload;
        },
        setMessage: (state, action: PayloadAction<string | null>) => {
            state.message = action.payload;
        },
        setModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload;
        },
        setIsApplying: (state, action: PayloadAction<boolean>) => {
            state.isApplying = action.payload;
        },
        reset: () => applyCouponInitialState,
    },
});

export const {actions: applyCouponActions} = applyCouponSlice;
export const {reducer: applyCouponReducer} = applyCouponSlice;
