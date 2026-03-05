import {
    configureStore,
    type ReducersMapObject,
    type ThunkDispatch,
    type UnknownAction,
} from "@reduxjs/toolkit";

import {toastReducer} from "@/app/providers/toast/model/slice/toastSlice";

import {cartReducer} from "@/entities/cart";
import {
    applyAuthSession,
    clearUserSession,
    selectAccessToken,
    type AuthSessionResponse,
    userReducer,
} from "@/entities/user";

import {baseAPI, configureBaseQueryWithReauth} from "@/shared/api";
import type {DeepPartial} from "@/shared/lib";

import {cartListenerMiddleware} from "../middleware/cartListenerMiddleware";

import {createReducerManager} from "./reducerManager";
import {type AppStore, type StateSchema} from "./StateSchema";
import {createStoreServices} from "./StoreServices";

export const createStore = (
    initialState?: StateSchema,
    asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>,
): AppStore => {
    configureBaseQueryWithReauth<AuthSessionResponse>({
        selectAccessToken,
        applyAuthSession,
        clearUserSession,
    });

    const rootReducer: ReducersMapObject<StateSchema> = {
        user: userReducer,
        toast: toastReducer,
        cart: cartReducer,
        [baseAPI.reducerPath]: baseAPI.reducer,
        ...(asyncReducers as Partial<ReducersMapObject<StateSchema>>),
    };

    const reducerManager = createReducerManager(rootReducer);

    const store = configureStore({
        preloadedState: initialState,
        reducer: (state, action) => {
            return reducerManager.reduce(state ?? ({} as StateSchema), action);
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(baseAPI.middleware)
                .prepend(cartListenerMiddleware.middleware),
        devTools: true,
    }) as AppStore;

    store.reducerManager = reducerManager;
    store.services = createStoreServices();

    return store;
};

export type AppDispatch = ThunkDispatch<StateSchema, unknown, UnknownAction>;
