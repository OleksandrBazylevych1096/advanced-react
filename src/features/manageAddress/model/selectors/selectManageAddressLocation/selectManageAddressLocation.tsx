import type { StateSchema } from "@/app/store";

export const selectManageAddressLocation = (state: StateSchema) =>
  state.manageAddress?.location ?? [51.505, -0.09];
