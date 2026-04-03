import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import type {ProductSearchSchema} from "../types/productSearchSchema";

export const initialState: ProductSearchSchema = {
    query: "",
    isFocused: false,
    isQueryValid: false,
    submittedEvent: null,
    nextEventId: 1,
};

export const productSearchSlice = createSlice({
    name: "productSearch",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        setFocused: (state, action: PayloadAction<boolean>) => {
            state.isFocused = action.payload;
        },
        setQueryValid: (state, action: PayloadAction<boolean>) => {
            state.isQueryValid = action.payload;
        },
        submitQuery: (state, action: PayloadAction<string>) => {
            state.submittedEvent = {
                id: state.nextEventId,
                query: action.payload,
            };
            state.nextEventId += 1;
        },
        syncQueryFromUrl: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
    },
});

export const {actions: productSearchActions, reducer: productSearchReducer} = productSearchSlice;
