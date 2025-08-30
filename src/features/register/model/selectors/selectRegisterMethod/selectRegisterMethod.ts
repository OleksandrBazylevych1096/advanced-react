import type { StateSchema } from "@/app/store";

import { AuthMethod } from "@/shared/config";

export const selectRegisterMethod = (state: StateSchema) =>
  state.registerForm?.method ?? AuthMethod.EMAIL;
