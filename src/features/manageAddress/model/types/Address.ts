import type { LatLngTuple } from "leaflet";

export interface ManageAddressSchema {
  editingAddressId?: string;

  location: LatLngTuple;

  form: AddressForm;

  mode: AddressMode;
}

export type AddressMode = "choose" | "edit" | "add";

export interface ShippingAddress {
  id: string;
  streetAddress: string;
  city: string;
  numberOfApartment: string;
  zipCode: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface CreateShippingAddress extends AddressForm {
  latitude: number;
  longitude: number;
}

export interface UpdateShippingAddress extends Partial<AddressForm> {
  latitude?: number;
  longitude?: number;
}

export interface AddressForm {
  streetAddress: string;
  city: string;
  numberOfApartment: string;
  zipCode: string;
}

export interface AddressSearchResult {
  lat: number;
  lon: number;
  displayName: string;
}

export interface ReverseGeocodeResult extends BaseAddress {
  label: string;
}

export interface BaseAddress {
  country: string;
  state: string;
  postcode?: string;
  city: string;
  street?: string;
  housenumber?: string;
  name?: string;
}
