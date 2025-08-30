import type { StateSchema } from "@/app/store";

export const selectRegisterPassword = (state: StateSchema) =>
  state.registerForm?.password ?? "";
