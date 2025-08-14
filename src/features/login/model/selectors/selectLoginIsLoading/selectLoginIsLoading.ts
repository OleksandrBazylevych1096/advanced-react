import type { StateSchema } from "@/app/store";

export const selectLoginIsLoading = (state: StateSchema) =>
  state.loginForm?.isLoading;
