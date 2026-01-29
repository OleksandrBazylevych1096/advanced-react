import type {ReverseGeocodeResult, ShippingAddress} from '@/features/manageAddress/model/types/Address.ts';

import {createMockFactory, sequence} from "@/shared/lib/test/createMockFactories.ts";


const createMockGeocodeResult = createMockFactory<ReverseGeocodeResult>({
    label: (i) => `${i} Test Street, London, WC2N ${i}DN`,
    name: (i) => `Location ${i}`,
    street: (i) => `Test Street ${i}`,
    housenumber: (i) => String(i),
    city: 'London',
    postcode: (i) => `WC2N ${i}DN`,
    country: 'United Kingdom',
});

const createMockShippingAddress = createMockFactory<ShippingAddress>({
    id: sequence('addr'),
    streetAddress: (i) => `${i} Main Street`,
    city: 'London',
    numberOfApartment: (i) => String(i),
    zipCode: (i) => `WC2N ${i}DN`,
    isDefault: false,
    latitude: () => 51.5074,
    longitude: () => -0.1278,
});

export const mockGeocodeLondon: ReverseGeocodeResult = createMockGeocodeResult({
    label: 'Trafalgar Square, London, WC2N 5DN',
    name: 'Trafalgar Square',
    street: 'Trafalgar Square',
    housenumber: '1',
    postcode: 'WC2N 5DN',
});

export const mockStreetSuggestions = [
    {
        displayName: 'Baker Street, London, UK',
        lat: 51.5237,
        lon: -0.1585,
        address: {
            road: 'Baker Street',
            city: 'London',
            country: 'United Kingdom',
        },
    },
    {
        displayName: 'Oxford Street, London, UK',
        lat: 51.5152,
        lon: -0.1419,
        address: {
            road: 'Oxford Street',
            city: 'London',
            country: 'United Kingdom',
        },
    },
];

export const mockCitySuggestions = [
    {
        displayName: 'London, England, United Kingdom',
        lat: 51.5074,
        lon: -0.1278,
        address: {
            city: 'London',
            country: 'United Kingdom',
        },
    },
    {
        displayName: 'Manchester, England, United Kingdom',
        lat: 53.4808,
        lon: -2.2426,
        address: {
            city: 'Manchester',
            country: 'United Kingdom',
        },
    },
];

export const mockSingleAddress: ShippingAddress = createMockShippingAddress({
    id: '1',
    streetAddress: '1 Trafalgar Square',
    city: 'London',
    numberOfApartment: '5',
    zipCode: 'WC2N 5DN',
    isDefault: true,
    latitude: 51.5074,
    longitude: -0.1278,
});

export const mockAddresses: ShippingAddress[] = [
    createMockShippingAddress({
        id: '1',
        streetAddress: '1 Trafalgar Square',
        numberOfApartment: '5',
        zipCode: 'WC2N 5DN',
        isDefault: true,
        latitude: 51.5074,
        longitude: -0.1278,
    }),
    createMockShippingAddress({
        id: '2',
        streetAddress: '221B Baker Street',
        numberOfApartment: 'B',
        zipCode: 'NW1 6XE',
        isDefault: false,
        latitude: 51.5237,
        longitude: -0.1585,
    }),
    createMockShippingAddress({
        id: '3',
        streetAddress: '100 Oxford Street',
        numberOfApartment: '12',
        zipCode: 'W1D 1BS',
        isDefault: false,
        latitude: 51.5152,
        longitude: -0.1419,
    }),
];


export const mockManyAddresses = createMockShippingAddress.createList(10, (i) => ({
    id: `address-${i + 1}`,
    streetAddress: `${i + 1} Main Street`,
    numberOfApartment: String(i + 1),
    zipCode: `WC2N ${i}DN`,
    isDefault: i === 0,
    latitude: 51.5074 + i * 0.01,
    longitude: -0.1278 + i * 0.01,
}));


export const mockManyStreetSuggestions = Array.from({length: 10}, (_, i) => ({
    displayName: `Main Street ${i + 1}, London, UK`,
    lat: 51.5074 + i * 0.01,
    lon: -0.1278 + i * 0.01,
    address: {
        road: `Main Street ${i + 1}`,
        city: 'London',
        country: 'United Kingdom',
    },
}));