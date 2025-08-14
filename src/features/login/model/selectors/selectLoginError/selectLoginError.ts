import type { StateSchema } from "@/app/store";

export const selectLoginError = (state: StateSchema) => state.loginForm?.error;
