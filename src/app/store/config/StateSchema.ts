import type {
  EnhancedStore,
  Reducer,
  ReducersMapObject,
  UnknownAction,
} from "@reduxjs/toolkit";

import type { AuthByGoogleSchema } from "@/features/authByGoogle";
import type { LoginFormSchema } from "@/features/login";
import type { RegisterFormSchema } from "@/features/register";

import type { UserSchema } from "@/entities/user";

import type { baseAPI } from "@/shared/api";

import type { ToastSchema } from "../../providers/toast/model/types/toast";

export interface StateSchema {
  user: UserSchema;
  authByGoogle: AuthByGoogleSchema;
  toast: ToastSchema;
  [baseAPI.reducerPath]: ReturnType<typeof baseAPI.reducer>;
  loginForm?: LoginFormSchema;
  registerForm?: RegisterFormSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  getMountedReducers: () => Partial<Record<StateSchemaKey, boolean>>;
  reduce: (
    state: StateSchema | undefined,
    action: UnknownAction
  ) => StateSchema;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}
