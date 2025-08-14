import type { StateSchema } from "@/app/store";

export const selectLoginPassword = (state: StateSchema) =>
  state.loginForm?.password;
