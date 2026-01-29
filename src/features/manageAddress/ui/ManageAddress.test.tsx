import {screen, waitFor} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi} from "vitest";

import type {StateSchema} from "@/app/store";

import {
    defaultAddressHandlers,
    deleteAddressHandlers,
    geocodeHandlers,
    listAddressHandlers,
    searchHandlers,
    setDefaultAddressHandlers,
} from "@/features/manageAddress/api/test/handlers.ts";
import {mockAddresses, mockSingleAddress} from "@/features/manageAddress/api/test/mockData.ts";
import {manageAddressReducer} from "@/features/manageAddress/model/slice/addressSlice.ts";

import type {DeepPartial} from "@/shared/lib";
import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";
import {renderWithProviders} from "@/shared/lib/test/renderWithProviders";

import {ManageAddress} from "./ManageAddress";

const handlerSets = {
    list: listAddressHandlers,
    defaultAddress: defaultAddressHandlers,
    search: searchHandlers,
    delete: deleteAddressHandlers,
    setDefault: setDefaultAddressHandlers,
    geocode: geocodeHandlers,
};

const baseHandlers = createHandlersScenario('default', handlerSets);
const server = setupServer(...baseHandlers);

const ASYNC_TIMEOUT = {timeout: 5000};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ManageAddress Integration Tests", () => {
    const defaultInitialState: DeepPartial<StateSchema> = {
        user: {
            userData: {
                id: "user-1",
                email: "test@example.com",
                isVerified: true
            },
        },
        manageAddress: {
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

    const renderManageAddress = (stateOverrides?: DeepPartial<StateSchema>) => {
        const state = stateOverrides
            ? {...defaultInitialState, ...stateOverrides}
            : defaultInitialState;

        return renderWithProviders(
            <ManageAddress/>,
            {
                initialState: state as StateSchema,
                asyncReducers: {manageAddress: manageAddressReducer},
            }
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Rendering", () => {
        test("should render address trigger button with street address", async () => {
            renderManageAddress();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            expect(screen.getByTestId("manage-address-street")).toHaveTextContent(mockSingleAddress.streetAddress);
        });

        test("should render loading state initially", async () => {
            server.use(...createHandlersScenario('loading', handlerSets));

            renderManageAddress();

            expect(screen.getByTestId("manage-address-loading")).toBeInTheDocument();
        });

        test("should render fallback address on error", async () => {
            server.use(...createHandlersScenario('error', handlerSets));

            renderManageAddress();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-fallback")).toBeInTheDocument();
            });
        });

        test("should render sign-in prompt when user is not logged in", async () => {
            renderManageAddress({user: {userData: undefined}});

            const user = userEvent.setup();
            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-signin-prompt")).toBeInTheDocument();
            });

            expect(screen.getByTestId("manage-address-signin-btn")).toBeInTheDocument();
        });
    });

    describe("Address List Modal", () => {
        test("should open modal and show address list on click", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            for (const address of mockAddresses) {
                expect(screen.getByTestId(`address-item-${address.id}`)).toBeInTheDocument();
                expect(screen.getByTestId(`address-item-${address.id}-street`)).toHaveTextContent(address.streetAddress);
            }
        });

        test("should render loading state in modal when fetching addresses", async () => {
            server.use(...createHandlersScenario('loading', handlerSets));

            renderManageAddress();

            const user = userEvent.setup();
            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-loader")).toBeInTheDocument();
            });
        });

        test("should render empty state when no addresses exist", async () => {
            server.use(listAddressHandlers.empty, defaultAddressHandlers.noDefault);

            renderManageAddress();

            const user = userEvent.setup();
            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.queryByTestId("address-list")).not.toBeInTheDocument();
            });
        });
    });

    describe("Address Selection", () => {
        test("should highlight default address with checked radio", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const defaultAddress = mockAddresses.find(addr => addr.isDefault);
            if (defaultAddress) {
                const radio = screen.getByTestId(`address-item-${defaultAddress.id}-radio`);
                expect(radio).toBeChecked();
            }
        });

        test("should show non-default addresses with unchecked radios", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const nonDefaultAddresses = mockAddresses.filter(addr => !addr.isDefault);
            for (const address of nonDefaultAddresses) {
                const radio = screen.getByTestId(`address-item-${address.id}-radio`);
                expect(radio).not.toBeChecked();
            }
        });

        test("should allow clicking on address item to select it", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const secondAddress = mockAddresses.find(addr => !addr.isDefault);
            if (secondAddress) {
                const addressItem = screen.getByTestId(`address-item-${secondAddress.id}`);
                await user.click(addressItem);

                expect(addressItem).toBeInTheDocument();
            }
        });
    });

    describe("Add New Address", () => {
        test("should show add address button in address list footer", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            expect(screen.getByTestId("address-list-add-btn")).toBeInTheDocument();
        });

        test("should switch to add mode and show form when clicking add address button", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const addButton = screen.getByTestId("address-list-add-btn");
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByTestId("edit-address-form")).toBeInTheDocument();
            }, ASYNC_TIMEOUT);

            expect(screen.getByTestId("edit-address-street-input")).toBeInTheDocument();
            expect(screen.getByTestId("edit-address-city-input")).toBeInTheDocument();
            expect(screen.getByTestId("edit-address-apartment-input")).toBeInTheDocument();
            expect(screen.getByTestId("edit-address-zipcode-input")).toBeInTheDocument();
            expect(screen.getByTestId("edit-address-submit-btn")).toBeInTheDocument();
        });

        test("should show back button in add mode", async () => {
            renderManageAddress({
                manageAddress: {
                    ...defaultInitialState.manageAddress,
                    mode: "add",
                },
            });

            const user = userEvent.setup();
            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-back-btn")).toBeInTheDocument();
            });
        });
    });

    describe("Edit Address", () => {
        test("should show edit button on each address item", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            for (const address of mockAddresses) {
                expect(screen.getByTestId(`address-item-${address.id}-edit-btn`)).toBeInTheDocument();
            }
        });

        test("should switch to edit mode and show form when clicking edit button", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const firstAddress = mockAddresses[0];
            const editButton = screen.getByTestId(`address-item-${firstAddress.id}-edit-btn`);
            await user.click(editButton);

            await waitFor(() => {
                expect(screen.getByTestId("edit-address-form")).toBeInTheDocument();
            }, ASYNC_TIMEOUT);
        });
    });

    describe("Delete Address", () => {
        test("should show delete button on each address item", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            for (const address of mockAddresses) {
                expect(screen.getByTestId(`address-item-${address.id}-delete-btn`)).toBeInTheDocument();
            }
        });

        test("should show delete confirmation modal when clicking delete", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const firstAddress = mockAddresses[0];
            const deleteButton = screen.getByTestId(`address-item-${firstAddress.id}-delete-btn`);
            await user.click(deleteButton);

            await waitFor(() => {
                expect(screen.getByTestId("delete-confirmation-modal")).toBeInTheDocument();
            });

            expect(screen.getByTestId("delete-confirmation-header")).toBeInTheDocument();
            expect(screen.getByTestId("delete-confirmation-body")).toBeInTheDocument();
            expect(screen.getByTestId("delete-confirmation-cancel-btn")).toBeInTheDocument();
            expect(screen.getByTestId("delete-confirmation-confirm-btn")).toBeInTheDocument();
        });
    });

    describe("Modal Navigation", () => {
        test("should return to address list when clicking back button in add mode", async () => {
            renderManageAddress();

            const user = userEvent.setup();

            await waitFor(() => {
                expect(screen.getByTestId("manage-address-street")).toBeInTheDocument();
            });

            const triggerButton = screen.getByTestId("manage-address-trigger");
            await user.click(triggerButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });

            const addButton = screen.getByTestId("address-list-add-btn");
            await user.click(addButton);

            await waitFor(() => {
                expect(screen.getByTestId("edit-address-form")).toBeInTheDocument();
            }, ASYNC_TIMEOUT);

            const backButton = screen.getByTestId("manage-address-back-btn");
            await user.click(backButton);

            await waitFor(() => {
                expect(screen.getByTestId("address-list")).toBeInTheDocument();
            });
        });
    });
});
