import type {Meta, StoryObj} from "@storybook/react-vite";

import {productSearchReducer, type ProductSearchSchema} from "@/features/product-search";

import {productsHandlers} from "@/entities/product/api/test/handlers";

import {createHandlersScenario} from "@/shared/lib/testing";

import {popularSearchesHandlers, searchHistoryHandlers} from "../api/test/handlers";

import {SearchPanel} from "./SearchPanel";

const handlersMap = {
    suggestions: productsHandlers,
    history: searchHistoryHandlers,
    popular: popularSearchesHandlers,
};

const defaultProductSearchState: ProductSearchSchema = {
    query: "",
    isFocused: false,
    isQueryValid: false,
    submittedEvent: null,
    nextEventId: 1,
};

const withProductSearchState = (productSearch: ProductSearchSchema): Partial<StateSchema> => ({
    productSearch,
    user: {
        currency: "USD",
    },
});

const authenticatedUserState: Partial<StateSchema["user"]> = {
    currency: "USD",
    userData: {
        id: "u1",
        email: "john@example.com",
        provider: "LOCAL",
    },
    accessToken: "token",
    accessTokenExpiresAt: "2099-01-01T00:00:00.000Z",
};

const historyOpenInitialState = {
    ...withProductSearchState({
        ...defaultProductSearchState,
        isFocused: true,
        isQueryValid: false,
    }),
    user: authenticatedUserState,
} as Partial<StateSchema>;

const meta = {
    title: "widgets/SearchPanel",
    component: SearchPanel,
    parameters: {
        layout: "padded",
        asyncReducers: {
            productSearch: productSearchReducer,
        },
        initialState: withProductSearchState(defaultProductSearchState),
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
} satisfies Meta<typeof SearchPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SuggestionsOpen: Story = {
    parameters: {
        initialState: withProductSearchState({
            ...defaultProductSearchState,
            isFocused: true,
            isQueryValid: true,
            query: "milk",
        }),
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const SuggestionsLoading: Story = {
    parameters: {
        initialState: withProductSearchState({
            ...defaultProductSearchState,
            isFocused: true,
            isQueryValid: true,
            query: "mil",
        }),
        msw: {
            handlers: createHandlersScenario("loading", handlersMap, {
                history: searchHistoryHandlers.default,
                popular: popularSearchesHandlers.default,
            }),
        },
    },
};

export const SuggestionsEmpty: Story = {
    parameters: {
        initialState: withProductSearchState({
            ...defaultProductSearchState,
            isFocused: true,
            isQueryValid: true,
            query: "zzzz",
        }),
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                suggestions: productsHandlers.empty,
            }),
        },
    },
};

export const HistoryBlockOpen: Story = {
    parameters: {
        initialState: historyOpenInitialState,
    },
};

export const HistoryBlockEmpty: Story = {
    parameters: {
        initialState: historyOpenInitialState,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                history: searchHistoryHandlers.empty,
                popular: popularSearchesHandlers.empty,
            }),
        },
    },
};

export const HistoryBlockLoading: Story = {
    parameters: {
        initialState: historyOpenInitialState,
        msw: {
            handlers: createHandlersScenario("loading", handlersMap, {
                history: searchHistoryHandlers.loading,
                popular: popularSearchesHandlers.loading,
            }),
        },
    },
};

export const HistoryBlockError: Story = {
    parameters: {
        initialState: historyOpenInitialState,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                history: searchHistoryHandlers.error,
                popular: popularSearchesHandlers.error,
            }),
        },
    },
};
