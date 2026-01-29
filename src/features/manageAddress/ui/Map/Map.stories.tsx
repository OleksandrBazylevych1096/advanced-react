import type {Meta, StoryObj} from "@storybook/react-vite";
import type {LatLngTuple} from "leaflet";

import type {StateSchema} from "@/app/store";

import {geocodeHandlers} from "@/features/manageAddress/api/test/handlers.ts";
import {manageAddressReducer} from "@/features/manageAddress/model/slice/addressSlice";

import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";


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

const MapHandlersMap = {
    geocode: geocodeHandlers
}


export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('default', MapHandlersMap)
        },
    },
};


export const LoadingGeocode: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('loading', MapHandlersMap)

        },
    },
};


export const GeocodeError: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario('error', MapHandlersMap)

        },
    },
};


