import type { StateSchema } from "@/app/store";

export const selectRegisterError = (state: StateSchema) => state.registerForm?.error;
