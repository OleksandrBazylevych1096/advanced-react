import type { StateSchema } from "@/app/store";

export const selectLoginPhone = (state: StateSchema) =>
  state.loginForm?.phone ?? "";
