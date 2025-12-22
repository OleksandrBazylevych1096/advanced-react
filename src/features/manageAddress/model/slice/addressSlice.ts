import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LatLngTuple } from "leaflet";

import type {
  AddressForm,
  AddressMode,
  ManageAddressSchema,
} from "../types/Address";

const DEFAULT_LOCATION: LatLngTuple = [51.505, -0.09];

export const initialState: ManageAddressSchema = {
  form: {
    city: "",
    numberOfApartment: "",
    streetAddress: "",
    zipCode: "",
  },
  location: DEFAULT_LOCATION,
  mode: "choose",
  editingAddressId: undefined,
};

export const manageAddressSlice = createSlice({
  name: "manageAddress",
  initialState,
  reducers: {
    setFormCity: (state, action: PayloadAction<string>) => {
      state.form.city = action.payload;
    },
    setFormNumberOfApartment: (state, action: PayloadAction<string>) => {
      state.form.numberOfApartment = action.payload;
    },
    setFormStreetAddress: (state, action: PayloadAction<string>) => {
      state.form.streetAddress = action.payload;
    },
    setFormZipCode: (state, action: PayloadAction<string>) => {
      state.form.zipCode = action.payload;
    },
    setForm: (state, action: PayloadAction<AddressForm>) => {
      state.form = action.payload;
    },
    resetForm: (state) => {
      state.form = initialState.form;
    },
    setLocation: (state, action: PayloadAction<LatLngTuple>) => {
      state.location = action.payload;
    },
    resetLocation: (state) => {
      state.location = DEFAULT_LOCATION;
    },
    setMode: (state, action: PayloadAction<AddressMode>) => {
      state.mode = action.payload;
    },
    setEditingAddressId: (state, action: PayloadAction<string | undefined>) => {
      state.editingAddressId = action.payload;
    },
    initializeEditMode: (
      state,
      action: PayloadAction<{
        id: string;
        form: AddressForm;
        location: LatLngTuple;
      }>
    ) => {
      state.mode = "edit";
      state.editingAddressId = action.payload.id;
      state.form = action.payload.form;
      state.location = action.payload.location;
    },
    initializeAddMode: (
      state,
      action: PayloadAction<{ location?: LatLngTuple }>
    ) => {
      state.mode = "add";
      state.editingAddressId = undefined;
      state.form = initialState.form;
      state.location = action.payload.location || DEFAULT_LOCATION;
    },
    returnToChoose: (state) => {
      state.mode = "choose";
      state.editingAddressId = undefined;
      state.form = initialState.form;
    },
    reset: () => initialState,
  },
});

export const { actions: manageAddressActions } = manageAddressSlice;

export const { reducer: manageAddressReducer } = manageAddressSlice;
