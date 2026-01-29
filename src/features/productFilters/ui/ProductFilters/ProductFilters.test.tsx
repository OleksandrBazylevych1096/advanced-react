import {screen, waitFor} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {setupServer} from "msw/node";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi} from "vitest";

import type {StateSchema} from "@/app/store";

import {productFiltersReducer} from "@/features/productFilters";

import {categoryHandlers} from "@/entities/category/api/test/handlers.ts";
import {productsHandlers} from "@/entities/product/api/test/handlers.ts";
import {mockFacets} from "@/entities/product/api/test/mockData.ts";

import type {DeepPartial} from "@/shared/lib";
import {createHandlersScenario} from "@/shared/lib/test/msw/createHandlersScenario.ts";
import {renderWithProviders} from "@/shared/lib/test/renderWithProviders";

import {ProductFilters} from "./ProductFilters";


const handlerSets = {
    category: categoryHandlers,
    products: productsHandlers,
};

const baseHandlers = createHandlersScenario('default', handlerSets);
const server = setupServer(...baseHandlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ProductFilters Integration Tests", () => {
    const defaultInitialState: DeepPartial<StateSchema> = {
        productFilters: {
            filters: {
                priceRange: {min: undefined, max: undefined},
                countries: [],
                brands: [],
                inStock: false,
                sortBy: "name",
                sortOrder: "asc",
            },
            isOpen: true,
        },
        user: {
            currency: "USD",
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const [country1, country2, country3, country4] = mockFacets.countries.map(c => c.value);
    const [brand1, brand2, brand3, brand4] = mockFacets.brands.map(b => b.value);
    const getCountryTestId = (value: string) => `filter-section-countries-option-${value}`;
    const getBrandTestId = (value: string) => `filter-section-brands-option-${value}`;


    describe("Rendering", () => {
        test("should render filter sidebar with title", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["price", "brands", "countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            expect(screen.getByTestId("product-filters-sidebar")).toBeInTheDocument();
            expect(screen.getByTestId("product-filters-title")).toBeInTheDocument();
        });

        test("should render loading state initially", async () => {
            server.use(...createHandlersScenario('loading', handlerSets));

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands", "price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            expect(screen.getByTestId("filter-section-countries-loading")).toBeInTheDocument();
            expect(screen.getByTestId("filter-section-brands-loading")).toBeInTheDocument();
            expect(screen.getByTestId("filter-section-price-loading")).toBeInTheDocument();
        });

        test("should render facets after loading", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands", "price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            expect(screen.getByTestId(getCountryTestId(country2))).toBeInTheDocument();
            expect(screen.getByTestId(getCountryTestId(country3))).toBeInTheDocument();
            expect(screen.getByTestId(getCountryTestId(country4))).toBeInTheDocument();

            expect(screen.getByTestId(getBrandTestId(brand1))).toBeInTheDocument();
            expect(screen.getByTestId(getBrandTestId(brand2))).toBeInTheDocument();
            expect(screen.getByTestId(getBrandTestId(brand3))).toBeInTheDocument();
            expect(screen.getByTestId(getBrandTestId(brand4))).toBeInTheDocument();

            expect(screen.getByTestId("filter-section-price-min-input")).toBeInTheDocument();
            expect(screen.getByTestId("filter-section-price-max-input")).toBeInTheDocument();
        });

        test("should render error state when API fails", async () => {
            server.use(...createHandlersScenario('error', handlerSets));

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands", "price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId("product-filters-error")).toBeInTheDocument();
            });
        });
    });

    describe("Country Filter Interactions", () => {
        test("should toggle country filter when clicking checkbox", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const country1Checkbox = screen.getByTestId(getCountryTestId(country1));
            expect(country1Checkbox).not.toBeChecked();

            await user.click(country1Checkbox);

            expect(country1Checkbox).toBeChecked();
        });

        test("should uncheck country filter when clicking again", async () => {
            const user = userEvent.setup();

            const stateWithSelectedCountry: DeepPartial<StateSchema> = {
                ...defaultInitialState,
                productFilters: {
                    ...defaultInitialState.productFilters,
                    filters: {
                        ...defaultInitialState.productFilters?.filters,
                        countries: [country1],
                    },
                },
            };

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: stateWithSelectedCountry as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const country1Checkbox = screen.getByTestId(getCountryTestId(country1));
            expect(country1Checkbox).toBeChecked();

            await user.click(country1Checkbox);

            expect(country1Checkbox).not.toBeChecked();
        });

        test("should allow selecting multiple countries", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const country1Checkbox = screen.getByTestId(getCountryTestId(country1));
            const country2Checkbox = screen.getByTestId(getCountryTestId(country2));
            const country3Checkbox = screen.getByTestId(getCountryTestId(country3));

            await user.click(country1Checkbox);
            await user.click(country2Checkbox);
            await user.click(country3Checkbox);

            expect(country1Checkbox).toBeChecked();
            expect(country2Checkbox).toBeChecked();
            expect(country3Checkbox).toBeChecked();
        });
    });

    describe("Brand Filter Interactions", () => {
        test("should toggle brand filter when clicking checkbox", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["brands"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getBrandTestId(brand1))).toBeInTheDocument();
            });

            const brand1Checkbox = screen.getByTestId(getBrandTestId(brand1));
            expect(brand1Checkbox).not.toBeChecked();

            await user.click(brand1Checkbox);

            expect(brand1Checkbox).toBeChecked();
        });

        test("should allow selecting multiple brands", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["brands"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getBrandTestId(brand1))).toBeInTheDocument();
            });

            const brand1Checkbox = screen.getByTestId(getBrandTestId(brand1));
            const brand2Checkbox = screen.getByTestId(getBrandTestId(brand2));

            await user.click(brand1Checkbox);
            await user.click(brand2Checkbox);

            expect(brand1Checkbox).toBeChecked();
            expect(brand2Checkbox).toBeChecked();
        });
    });

    describe("Price Filter Interactions", () => {
        test("should render price range inputs", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId("filter-section-price-min-input")).toBeInTheDocument();
            });

            expect(screen.getByTestId("filter-section-price-max-input")).toBeInTheDocument();
        });

        test("should render price slider", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId("range-slider")).toBeInTheDocument();
            });

            expect(screen.getByTestId("slider-thumb-0")).toBeInTheDocument();
            expect(screen.getByTestId("slider-thumb-1")).toBeInTheDocument();
        });
    });

    describe("Reset Filters", () => {
        test("should show disabled reset button when no filters are active", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands", "price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const resetButton = screen.getByTestId("product-filters-reset-btn");
            expect(resetButton).toBeDisabled();
        });

        test("should enable reset button when filters are active", async () => {
            const stateWithActiveFilters: DeepPartial<StateSchema> = {
                ...defaultInitialState,
                productFilters: {
                    ...defaultInitialState.productFilters,
                    filters: {
                        ...defaultInitialState.productFilters?.filters,
                        countries: [country1],
                    },
                },
            };

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands", "price"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: stateWithActiveFilters as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const resetButton = screen.getByTestId("product-filters-reset-btn");
            expect(resetButton).toBeEnabled();
        });

        test("should reset all filters when clicking reset button", async () => {
            const user = userEvent.setup();

            const stateWithActiveFilters: DeepPartial<StateSchema> = {
                ...defaultInitialState,
                productFilters: {
                    ...defaultInitialState.productFilters,
                    filters: {
                        ...defaultInitialState.productFilters?.filters,
                        countries: [country1, country3],
                        brands: [brand1],
                    },
                },
            };

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: stateWithActiveFilters as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const country1Checkbox = screen.getByTestId(getCountryTestId(country1));
            const country3Checkbox = screen.getByTestId(getCountryTestId(country3));
            const brand1Checkbox = screen.getByTestId(getBrandTestId(brand1));

            expect(country1Checkbox).toBeChecked();
            expect(country3Checkbox).toBeChecked();
            expect(brand1Checkbox).toBeChecked();

            const resetButton = screen.getByTestId("product-filters-reset-btn");
            await user.click(resetButton);

            await waitFor(() => {
                expect(country1Checkbox).not.toBeChecked();
            });
            expect(country3Checkbox).not.toBeChecked();
            expect(brand1Checkbox).not.toBeChecked();
        });
    });

    describe("Sidebar Toggle", () => {
        test("should render close button in sidebar", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            expect(screen.getByTestId("product-filters-close-btn")).toBeInTheDocument();
        });

        test("should render sidebar in open state when isOpen is true", async () => {
            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const sidebar = screen.getByTestId("product-filters-sidebar");
            expect(sidebar).toHaveClass(/open/);
        });

        test("should render sidebar in closed state when isOpen is false", async () => {
            const closedState: DeepPartial<StateSchema> = {
                ...defaultInitialState,
                productFilters: {
                    ...defaultInitialState.productFilters,
                    isOpen: false,
                },
            };

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: closedState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const sidebar = screen.getByTestId("product-filters-sidebar");
            expect(sidebar).not.toHaveClass(/open/);
        });
    });

    describe("Pre-selected Filters from Initial State", () => {
        test("should render with pre-selected countries", async () => {
            const stateWithPreselectedFilters: DeepPartial<StateSchema> = {
                ...defaultInitialState,
                productFilters: {
                    ...defaultInitialState.productFilters,
                    filters: {
                        ...defaultInitialState.productFilters?.filters,
                        countries: [country1, country3],
                    },
                },
            };

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: stateWithPreselectedFilters as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const country1Checkbox = screen.getByTestId(getCountryTestId(country1));
            const country3Checkbox = screen.getByTestId(getCountryTestId(country3));
            const country2Checkbox = screen.getByTestId(getCountryTestId(country2));

            expect(country1Checkbox).toBeChecked();
            expect(country3Checkbox).toBeChecked();
            expect(country2Checkbox).not.toBeChecked();
        });

        test("should render with pre-selected brands", async () => {
            const stateWithPreselectedFilters: DeepPartial<StateSchema> = {
                ...defaultInitialState,
                productFilters: {
                    ...defaultInitialState.productFilters,
                    filters: {
                        ...defaultInitialState.productFilters?.filters,
                        brands: [brand1, brand2],
                    },
                },
            };

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["brands"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: stateWithPreselectedFilters as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getBrandTestId(brand1))).toBeInTheDocument();
            });

            const brand1Checkbox = screen.getByTestId(getBrandTestId(brand1));
            const brand2Checkbox = screen.getByTestId(getBrandTestId(brand2));
            const brand3Checkbox = screen.getByTestId(getBrandTestId(brand3));

            expect(brand1Checkbox).toBeChecked();
            expect(brand2Checkbox).toBeChecked();
            expect(brand3Checkbox).not.toBeChecked();
        });
    });


    describe("Combined Filter Interactions", () => {
        test("should allow selecting both countries and brands", async () => {
            const user = userEvent.setup();

            renderWithProviders(
                <ProductFilters defaultOpenFilters={["countries", "brands"]}/>,
                {
                    route: "/en/category/electronics",
                    initialState: defaultInitialState as StateSchema,
                    asyncReducers: {productFilters: productFiltersReducer},
                }
            );

            await waitFor(() => {
                expect(screen.getByTestId(getCountryTestId(country1))).toBeInTheDocument();
            });

            const country1Checkbox = screen.getByTestId(getCountryTestId(country1));
            await user.click(country1Checkbox);

            const brand1Checkbox = screen.getByTestId(getBrandTestId(brand1));
            await user.click(brand1Checkbox);

            expect(country1Checkbox).toBeChecked();
            expect(brand1Checkbox).toBeChecked();

            const resetButton = screen.getByTestId("product-filters-reset-btn");
            expect(resetButton).toBeEnabled();
        });
    });
});