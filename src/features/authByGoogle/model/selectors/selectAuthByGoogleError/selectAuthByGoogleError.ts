import type { StateSchema } from "@/app/store";

export const selectAuthByGoogleError = (state: StateSchema) => state.authByGoogle.error