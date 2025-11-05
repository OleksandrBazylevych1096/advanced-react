import type { StateSchema } from "@/app/store";

export const selectToastNotifications = (state: StateSchema) =>
  state.toast.notifications ?? [];
