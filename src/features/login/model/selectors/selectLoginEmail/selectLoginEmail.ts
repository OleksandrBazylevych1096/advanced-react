import type { StateSchema } from "@/app/store";

export const selectLoginEmail = (state: StateSchema) =>
  state.loginForm?.email ?? "";
