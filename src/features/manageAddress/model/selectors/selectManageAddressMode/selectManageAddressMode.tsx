import type { StateSchema } from "@/app/store";

export const selectManageAddressMode = (state: StateSchema) =>
  state.manageAddress?.mode ?? "choose";
