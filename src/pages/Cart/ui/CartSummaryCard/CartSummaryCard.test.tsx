import {screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {mockCart} from "@/entities/cart/testing";

import {renderWithProviders} from "@/shared/lib/testing/react/renderWithProviders";

import {CartSummaryCard} from "./CartSummaryCard";

vi.mock("@/entities/cart", async () => {
    const actual = await vi.importActual<typeof import("@/entities/cart")>("@/entities/cart");

    return {
        ...actual,
        useCartValidation: () => ({
            data: {hasIssues: false, issues: []},
            status: {isValidating: false, isLoading: false, isError: false},
        }),
    };
});

describe("CartSummaryCard", () => {
    test("disables checkout button for guest user", () => {
        renderWithProviders(<CartSummaryCard cart={mockCart} />, {
            initialState: {
                user: {
                    userData: undefined,
                    currency: "USD",
                    isSessionReady: true,
                },
                cart: {
                    guestItems: [],
                    isInitialized: true,
                },
            } as StateSchema,
        });

        expect(screen.getByTestId("cart-proceed-to-checkout")).toBeDisabled();
        expect(screen.getByText("cart.signInToCheckout")).toBeInTheDocument();
    });

    test("keeps checkout button enabled for authenticated user without cart issues", () => {
        renderWithProviders(<CartSummaryCard cart={mockCart} />, {
            initialState: {
                user: {
                    userData: {id: "user-1", provider: "LOCAL"},
                    accessToken: "token-1",
                    currency: "USD",
                    isSessionReady: true,
                },
                cart: {
                    guestItems: [],
                    isInitialized: true,
                },
            } as StateSchema,
        });

        expect(screen.getByTestId("cart-proceed-to-checkout")).toBeEnabled();
        expect(screen.queryByText("cart.signInToCheckout")).not.toBeInTheDocument();
    });
});
