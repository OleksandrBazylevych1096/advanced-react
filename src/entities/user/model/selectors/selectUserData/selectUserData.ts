import type { StateSchema } from "@/app/store";

export const selectUserData = (state: StateSchema) => state.user.userData;
