import type {AppDispatch as ReduxAppDispatch, StateSchema as ReduxStateSchema} from "@/app/store";

declare global {
    type StateSchema = ReduxStateSchema;
    type AppDispatch = ReduxAppDispatch;
}

export {};
