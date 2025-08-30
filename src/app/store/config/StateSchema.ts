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

export interface StateSchema {
  user: UserSchema;
  authByGoogle: AuthByGoogleSchema;
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
