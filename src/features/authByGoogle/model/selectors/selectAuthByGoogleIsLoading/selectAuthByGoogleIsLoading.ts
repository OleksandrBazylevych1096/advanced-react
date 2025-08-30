import type { StateSchema } from "@/app/store";

export const selectAuthByGoogleIsLoading = (state: StateSchema) =>
  state.authByGoogle.isLoading;
