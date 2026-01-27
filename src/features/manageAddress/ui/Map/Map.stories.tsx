import type {Meta, StoryObj} from "@storybook/react-vite";
import type {LatLngTuple} from "leaflet";

import type {StateSchema} from "@/app/store";

import {handlers} from "@/features/manageAddress/lib/test/handlers.ts";
import {manageAddressReducer} from "@/features/manageAddress/model/slice/addressSlice";


import {Map} from "./Map";


import "leaflet/dist/leaflet.css";

const initialState: Partial<StateSchema> = {
    manageAddress: {
        mode: "add",
        location: [51.5074, -0.1277] as LatLngTuple,
        form: {
            city: "",
            streetAddress: "",
            zipCode: "",
            numberOfApartment: "",
        },
    },
}


const meta: Meta<typeof Map> = {
    title: "features/manageAddress/Map",
    component: Map,
    parameters: {
        asyncReducers: {
            manageAddress: manageAddressReducer,
        },
        layout: "fullscreen",
        initialState
    },
    decorators: [
        (Story) => (
            <div style={{height: "600px", width: "100%"}}>
                <Story/>
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Map>;


export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                handlers.geocodeSuccessLondon
            ],
        },
    },
};


export const LoadingGeocode: Story = {
    parameters: {
        msw: {
            handlers: [
                handlers.geocodeLoading
            ],
        },
    },
};


export const GeocodeError: Story = {
    parameters: {
        msw: {
            handlers: [
                handlers.geocodeError
            ],
        },
    },
};


