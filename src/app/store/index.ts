import type {
  StateSchema,
  StateSchemaKey,
  ReduxStoreWithManager,
} from "./config/StateSchema";
import { createStore, type AppDispatch } from "./config/store";

export { createStore };
export type { StateSchema, StateSchemaKey, AppDispatch, ReduxStoreWithManager };
