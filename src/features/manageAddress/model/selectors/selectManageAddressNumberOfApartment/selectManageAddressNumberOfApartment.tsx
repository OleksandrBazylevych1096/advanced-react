import type {StateSchema} from "@/app/store";

export const selectManageAddressNumberOfApartment = (state: StateSchema) =>
    state.manageAddress?.form?.numberOfApartment ?? "";
