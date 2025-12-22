import type {AnyAction, EnhancedStore, Reducer, ReducersMapObject,} from "@reduxjs/toolkit";

import type {ToastSchema} from "@/app/providers/toast/model/types/toast";

import type {AuthByGoogleSchema} from "@/features/authByGoogle/model/types/authByGoogle";
import type {LoginFormSchema} from "@/features/login";
import type {ManageAddressSchema} from "@/features/manageAddress/model/types/Address";
import type {ProductFiltersSchema} from "@/features/productFilters";
import type {RegisterFormSchema} from "@/features/register";

import type {UserSchema} from "@/entities/user";

import type {baseAPI} from "@/shared/api/rtk/baseAPI";

export interface StateSchema {
    user: UserSchema;
    authByGoogle: AuthByGoogleSchema;
    toast: ToastSchema;
    [baseAPI.reducerPath]: ReturnType<typeof baseAPI.reducer>;

    // Async reducers
    loginForm?: LoginFormSchema;
    registerForm?: RegisterFormSchema;
    manageAddress?: ManageAddressSchema;
    productFilters?: ProductFiltersSchema
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema | undefined, action: AnyAction) => StateSchema;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
    getMountedReducers: () => Partial<Record<StateSchemaKey, boolean>>;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}
