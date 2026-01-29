import type {Meta, StoryObj} from '@storybook/react-vite';


import {listAddressHandlers} from "@/features/manageAddress/api/test/handlers.ts";

import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";

import {AddressList} from './AddressList';

const meta = {
    title: 'features/manageAddress/AddressList',
    component: AddressList,
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof AddressList>;

export default meta;
type Story = StoryObj<typeof meta>;

const AddressListHandlersMap = {
    list: listAddressHandlers
}


export const WithAddresses: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', AddressListHandlersMap)
        },
    },
};

export const SingleAddress: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', AddressListHandlersMap, {list: listAddressHandlers.single})
        },
    },
};


export const EmptyList: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', AddressListHandlersMap, {list: listAddressHandlers.empty})
        },
    },
};


export const Loading: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('loading', AddressListHandlersMap)
        },
    },
};


export const Error: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('error', AddressListHandlersMap)
        },
    },
};


