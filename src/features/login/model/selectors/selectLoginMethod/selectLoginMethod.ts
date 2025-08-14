import type { StateSchema } from "@/app/store";

import { AuthMethod } from "@/shared/config";

export const selectLoginMethod = (state: StateSchema) =>
  state.loginForm?.method ?? AuthMethod.EMAIL;
