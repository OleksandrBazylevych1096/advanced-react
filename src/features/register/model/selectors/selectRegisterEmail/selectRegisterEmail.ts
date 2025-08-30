import type { StateSchema } from "@/app/store";

export const selectRegisterEmail = (state: StateSchema) =>
  state.registerForm?.email ?? "";
