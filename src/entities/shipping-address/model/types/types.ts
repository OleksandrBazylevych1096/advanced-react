import type {LatLngTuple} from "leaflet";

export interface ShippingAddress extends BaseShippingAddress {
    id: string;
    isDefault: boolean;
    latitude: number;
    longitude: number;
}

export interface CreateShippingAddress extends BaseShippingAddress {
    latitude: number;
    longitude: number;
}

export interface UpdateShippingAddress extends Partial<BaseShippingAddress> {
    latitude?: number;
    longitude?: number;
}

export interface BaseShippingAddress {
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
    state?: string;
    postcode?: string;
    city: string;
    street?: string;
    housenumber?: string;
    name?: string;
}

export type AddressMode = "choose" | "edit" | "add";

export interface SaveShippingAddressSchema {
    editingAddressId?: string;
    location: LatLngTuple;
    form: BaseShippingAddress;
    mode: AddressMode;
    isManageShippingAddressModalOpen: boolean;
}
