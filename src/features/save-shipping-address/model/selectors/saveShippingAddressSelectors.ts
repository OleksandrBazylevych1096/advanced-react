import {DEFAULT_LOCATION} from "../../consts/defaults";

export const selectSaveShippingAddressCity = (state: StateSchema) =>
    state.saveShippingAddress?.form?.city ?? "";

export const selectSaveShippingAddressId = (state: StateSchema) =>
    state.saveShippingAddress?.editingAddressId;

export const selectSaveShippingAddressLocation = (state: StateSchema) =>
    state.saveShippingAddress?.location ?? DEFAULT_LOCATION;

export const selectSaveShippingAddressMode = (state: StateSchema) =>
    state.saveShippingAddress?.mode ?? "choose";

export const selectIsManageShippingAddressModalOpen = (state: StateSchema) =>
    state.saveShippingAddress?.isManageShippingAddressModalOpen ?? false;

export const selectSaveShippingAddressNumberOfApartment = (state: StateSchema) =>
    state.saveShippingAddress?.form?.numberOfApartment ?? "";

export const selectSaveShippingAddressStreetAddress = (state: StateSchema) =>
    state.saveShippingAddress?.form?.streetAddress ?? "";

export const selectSaveShippingAddressZipCode = (state: StateSchema) =>
    state.saveShippingAddress?.form?.zipCode ?? "";
