import type {StateSchema} from "@/app/store";

export const selectManageAddressStreetAddress = (state: StateSchema) =>
    state.manageAddress?.form?.streetAddress ?? "";
