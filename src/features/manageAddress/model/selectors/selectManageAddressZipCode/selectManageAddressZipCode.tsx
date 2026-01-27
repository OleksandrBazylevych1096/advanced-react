import type {StateSchema} from "@/app/store";

export const selectManageAddressZipCode = (state: StateSchema) =>
    state.manageAddress?.form?.zipCode ?? "";
