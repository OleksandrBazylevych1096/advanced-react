import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import type {CartSchema, GuestCartItem} from "../types/CartSchema";

const initialState: CartSchema = {
    guestItems: [],
    isInitialized: false,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        initGuestCart: (state, action: PayloadAction<GuestCartItem[]>) => {
            state.guestItems = action.payload;
            state.isInitialized = true;
        },

        addItem: (state, action: PayloadAction<GuestCartItem>) => {
            const existing = state.guestItems.find(
                (item) => item.productId === action.payload.productId,
            );
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.guestItems.push(action.payload);
            }
        },

        removeItem: (state, action: PayloadAction<string>) => {
            state.guestItems = state.guestItems.filter((item) => item.productId !== action.payload);
        },

        updateQuantity: (state, action: PayloadAction<{productId: string; quantity: number}>) => {
            const item = state.guestItems.find((i) => i.productId === action.payload.productId);
            if (item) {
                if (action.payload.quantity <= 0) {
                    state.guestItems = state.guestItems.filter(
                        (i) => i.productId !== action.payload.productId,
                    );
                } else {
                    item.quantity = action.payload.quantity;
                }
            }
        },

        clearCart: (state) => {
            state.guestItems = [];
        },

        setGuestItems: (state, action: PayloadAction<GuestCartItem[]>) => {
            state.guestItems = action.payload;
        },
    },
});

export const {actions: cartActions} = cartSlice;
export const {reducer: cartReducer} = cartSlice;
