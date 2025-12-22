import type { StateSchema } from "@/app/store";

export const selectManageAddressId = (state: StateSchema) =>
  state.manageAddress?.editingAddressId;
