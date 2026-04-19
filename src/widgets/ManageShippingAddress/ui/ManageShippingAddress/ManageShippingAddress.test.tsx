import {screen, waitFor} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi} from "vitest";

import {saveShippingAddressReducer} from "@/features/save-shipping-address";

import {
    defaultAddressHandlers,
    geocodeHandlers,
    listAddressHandlers,
    searchHandlers,
} from "@/entities/shipping-address/testing";

import type {DeepPartial} from "@/shared/lib/state";
import {createHandlersScenario} from "@/shared/lib/testing";
import {renderWithProviders} from "@/shared/lib/testing/react/renderWithProviders";

import {ManageShippingAddress} from "./ManageShippingAddress";

const handlerSets = {
    list: listAddressHandlers,
    defaultAddress: defaultAddressHandlers,
    search: searchHandlers,
    geocode: geocodeHandlers,
};

const baseHandlers = createHandlersScenario("default", handlerSets);
const server = setupServer(...baseHandlers);

const ASYNC_TIMEOUT = {timeout: 5000};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ManageShippingAddress Inline Integration", () => {
    const defaultInitialState: DeepPartial<StateSchema> = {
        user: {
            userData: {
                id: "user-1",
                email: "test@example.com",
            },
            accessToken: "token-1",
        },
        saveShippingAddress: {
            mode: "choose",
            form: {
                city: "",
                numberOfApartment: "",
                streetAddress: "",
                zipCode: "",
            },
            location: [51.505, -0.09],
            editingAddressId: undefined,
        },
    };

    const renderManageShippingAddress = (stateOverrides?: DeepPartial<StateSchema>) => {
        const state = stateOverrides
            ? {...defaultInitialState, ...stateOverrides}
            : defaultInitialState;

        return renderWithProviders(<ManageShippingAddress />, {
            initialState: state as StateSchema,
            asyncReducers: {saveShippingAddress: saveShippingAddressReducer},
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders address list in choose mode without modal trigger", async () => {
        renderManageShippingAddress();

        await waitFor(() => {
            expect(screen.getByTestId("address-list")).toBeInTheDocument();
        });

        expect(screen.queryByTestId("manage-address-trigger")).not.toBeInTheDocument();
    });

    test("renders sign-in prompt for guest", async () => {
        renderManageShippingAddress({user: {userData: undefined, accessToken: undefined}});

        await waitFor(() => {
            expect(screen.getByTestId("manage-address-signin-prompt")).toBeInTheDocument();
        });

        expect(screen.getByTestId("manage-address-signin-btn")).toBeInTheDocument();
    });

    test("switches to edit form when add address button is clicked", async () => {
        renderManageShippingAddress();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByTestId("address-list")).toBeInTheDocument();
        });

        await user.click(screen.getByTestId("address-list-add-btn"));

        await waitFor(() => {
            expect(screen.getByTestId("edit-address-form")).toBeInTheDocument();
        }, ASYNC_TIMEOUT);
    });

    test("returns to list when back button clicked in add mode", async () => {
        renderManageShippingAddress();
        const user = userEvent.setup();

        await waitFor(() => {
            expect(screen.getByTestId("address-list")).toBeInTheDocument();
        });

        await user.click(screen.getByTestId("address-list-add-btn"));
        await waitFor(() => {
            expect(screen.getByTestId("manage-address-back-btn")).toBeInTheDocument();
        }, ASYNC_TIMEOUT);

        await user.click(screen.getByTestId("manage-address-back-btn"));

        await waitFor(() => {
            expect(screen.getByTestId("address-list")).toBeInTheDocument();
        });
    });
});
