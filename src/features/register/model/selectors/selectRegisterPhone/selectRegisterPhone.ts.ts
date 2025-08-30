import type { StateSchema } from "@/app/store";

export const selectRegisterPhone = (state: StateSchema) =>
  state.registerForm?.phone ?? "";
