import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import type {ChooseDeliveryTipSchema} from "../types/chooseDeliveryTipSchema";

export const chooseDeliveryTipInitialState: ChooseDeliveryTipSchema = {
    amount: 0,
};

export const chooseDeliveryTipSlice = createSlice({
    name: "chooseDeliveryTip",
    initialState: chooseDeliveryTipInitialState,
    reducers: {
        setAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
        },
        reset: () => chooseDeliveryTipInitialState,
    },
});

export const {actions: chooseDeliveryTipActions} = chooseDeliveryTipSlice;
export const {reducer: chooseDeliveryTipReducer} = chooseDeliveryTipSlice;
