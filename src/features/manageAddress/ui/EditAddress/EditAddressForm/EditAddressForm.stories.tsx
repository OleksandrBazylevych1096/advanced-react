import type {Meta, StoryObj} from '@storybook/react-vite';
import {fn} from 'storybook/test';

import {EditAddressFormView} from './EditAddressFormView';

const meta: Meta<typeof EditAddressFormView> = {
    title: "features/manageAddress/EditAddressForm",
    component: EditAddressFormView,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        onSubmit: (e) => e.preventDefault(),
        onStreetAddressChange: fn(),
        onCityChange: fn(),
        onApartmentChange: fn(),
        onZipCodeChange: fn(),
        onStreetFocus: fn(),
        onStreetBlur: fn(),
        onCityFocus: fn(),
        onCityBlur: fn(),
        onSuggestionClick: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof EditAddressFormView>;

export const Empty: Story = {
    args: {
        streetAddress: '',
        city: '',
        numberOfApartment: '',
        zipCode: '',
        showStreetSuggestions: false,
        showCitySuggestions: false,
        isSubmitting: false,
        canSave: false,
        mode: 'add',
    },
};

export const Filled: Story = {
    args: {
        streetAddress: 'Baker Street 221B',
        city: 'London',
        numberOfApartment: '2',
        zipCode: 'NW1 6XE',
        showStreetSuggestions: false,
        showCitySuggestions: false,
        isSubmitting: false,
        canSave: true,
        mode: 'edit',
    },
};

export const Submitting: Story = {
    args: {
        streetAddress: 'Baker Street 221B',
        city: 'London',
        numberOfApartment: '2',
        zipCode: 'NW1 6XE',
        showStreetSuggestions: false,
        showCitySuggestions: false,
        isSubmitting: true,
        canSave: true,
        mode: 'edit',
    },
};

export const WithStreetSuggestions: Story = {
    args: {
        streetAddress: 'Baker',
        city: 'London',
        numberOfApartment: '',
        zipCode: '',
        streetSuggestions: [
            {
                displayName: 'Baker Street, London',
                lat: 51.5237,
                lon: -0.1585,
            },
            {
                displayName: 'Baker Street, Westminster, London',
                lat: 51.5202,
                lon: -0.1551,
            },
        ],
        showStreetSuggestions: true,
        showCitySuggestions: false,
        isSubmitting: false,
        canSave: false,
        mode: 'add',
    },
};

export const WithCitySuggestions: Story = {
    args: {
        streetAddress: 'Baker Street 221B',
        city: 'Lon',
        numberOfApartment: '',
        zipCode: '',
        citySuggestions: [
            {
                displayName: 'London, United Kingdom',
                lat: 51.5074,
                lon: -0.1278,
            },
            {
                displayName: 'City of London, United Kingdom',
                lat: 51.5156,
                lon: -0.0910,
            },
        ],
        showStreetSuggestions: false,
        showCitySuggestions: true,
        isSubmitting: false,
        canSave: false,
        mode: 'add',
    },
};

export const Invalid: Story = {
    args: {
        streetAddress: 'Ba',
        city: 'Lo',
        numberOfApartment: '',
        zipCode: '',
        showStreetSuggestions: false,
        showCitySuggestions: false,
        isSubmitting: false,
        canSave: false,
        mode: 'add',
    },
};

export const EditMode: Story = {
    args: {
        streetAddress: 'Oxford Street 150',
        city: 'London',
        numberOfApartment: '12',
        zipCode: 'W1D 1NB',
        showStreetSuggestions: false,
        showCitySuggestions: false,
        isSubmitting: false,
        canSave: true,
        mode: 'edit',
    },
};
