import type {ReverseGeocodeResult, ShippingAddress} from "@/features/manageAddress/model/types/Address.ts";

export const mockGeocodeLondon: ReverseGeocodeResult = {
    label: "Trafalgar Square, London, WC2N 5DN",
    name: "Trafalgar Square",
    street: "Trafalgar Square",
    housenumber: "1",
    city: "London",
    postcode: "WC2N 5DN",
    country: "United Kingdom",
};

export const mockStreetSuggestions = [
    {
        displayName: "Baker Street, London, UK",
        lat: 51.5237,
        lon: -0.1585,
        address: {
            road: "Baker Street",
            city: "London",
            country: "United Kingdom"
        }
    },
    {
        displayName: "Oxford Street, London, UK",
        lat: 51.5152,
        lon: -0.1419,
        address: {
            road: "Oxford Street",
            city: "London",
            country: "United Kingdom"
        }
    }
];

export const mockCitySuggestions = [
    {
        displayName: "London, England, United Kingdom",
        lat: 51.5074,
        lon: -0.1278,
        address: {
            city: "London",
            country: "United Kingdom"
        }
    },
    {
        displayName: "Manchester, England, United Kingdom",
        lat: 53.4808,
        lon: -2.2426,
        address: {
            city: "Manchester",
            country: "United Kingdom"
        }
    }
];

export const mockSingleAddress: ShippingAddress = {
    id: "1",
    streetAddress: "1 Trafalgar Square",
    city: "London",
    numberOfApartment: "5",
    zipCode: "WC2N 5DN",
    isDefault: true,
    latitude: 51.5074,
    longitude: -0.1278,
};

export const mockAddresses: ShippingAddress[] = [
    {
        id: "1",
        streetAddress: "1 Trafalgar Square",
        city: "London",
        numberOfApartment: "5",
        zipCode: "WC2N 5DN",
        isDefault: true,
        latitude: 51.5074,
        longitude: -0.1278,
    },
    {
        id: "2",
        streetAddress: "221B Baker Street",
        city: "London",
        numberOfApartment: "B",
        zipCode: "NW1 6XE",
        isDefault: false,
        latitude: 51.5237,
        longitude: -0.1585,
    },
    {
        id: "3",
        streetAddress: "100 Oxford Street",
        city: "London",
        numberOfApartment: "12",
        zipCode: "W1D 1BS",
        isDefault: false,
        latitude: 51.5152,
        longitude: -0.1419,
    },
];