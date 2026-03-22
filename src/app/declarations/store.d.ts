import type {
    StateSchema as ReduxStateSchema,
    AppStore as ReduxAppStore,
} from "@/app/store/setup/StateSchema";
import type {AppDispatch as ReduxAppDispatch} from "@/app/store/setup/store";

declare global {
    type StateSchema = ReduxStateSchema;
    type AppDispatch = ReduxAppDispatch;
    type AppStore = ReduxAppStore;
}

export {};
