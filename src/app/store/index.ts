import type {StateSchema, StateSchemaKey, AppStore} from "./config/StateSchema";
import {createStore, type AppDispatch} from "./config/store";

export {createStore};
export type {StateSchema, StateSchemaKey, AppDispatch, AppStore};
