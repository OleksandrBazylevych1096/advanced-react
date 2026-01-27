import type {StateSchema} from "@/app/store";

export const selectManageAddressCity = (state: StateSchema) =>
    state.manageAddress?.form?.city ?? "";
