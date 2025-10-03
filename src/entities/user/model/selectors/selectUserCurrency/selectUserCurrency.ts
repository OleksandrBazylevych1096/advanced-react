import type { StateSchema } from "@/app/store";

export const selectUserCurrency = (state: StateSchema) => state.user.currency;
