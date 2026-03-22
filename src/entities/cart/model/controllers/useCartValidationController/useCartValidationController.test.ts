import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {createMockProduct} from "@/entities/product/api/test/mockData";

import type {CartItem, CartValidationItem} from "../../types/CartSchema";

import {useCartValidationController} from "./useCartValidationController";

const testCtx = vi.hoisted(() => ({
    validateQueryMock: vi.fn(),
    state: undefined as StateSchema | undefined,
}));

vi.mock("@/shared/lib/state", () => ({
    createControllerResult: <T>(value: T) => value,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.state as StateSchema),
}));

vi.mock("react-i18next", () => ({
    initReactI18next: {
        type: "3rdParty",
        init: () => undefined,
    },
    useTranslation: () => ({
        i18n: {
            language: "en",
        },
    }),
}));

vi.mock("../../../api/cartApi", () => ({
    useValidateCartQuery: (...args: unknown[]) => testCtx.validateQueryMock(...args),
}));

describe("useCartValidationController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.state = {user: {currency: "USD"}} as unknown as StateSchema;
        testCtx.validateQueryMock.mockReturnValue({
            data: undefined,
            isLoading: false,
        });
    });

    const items: CartItem[] = [
        {
            id: "c1",
            productId: "p1",
            quantity: 5,
            product: createMockProduct({
                id: "p1",
                name: "Product 1",
                price: 100,
                stock: 2,
            }),
        },
        {
            id: "c2",
            productId: "p2",
            quantity: 1,
            product: createMockProduct({
                id: "p2",
                name: "Product 2",
                price: 50,
                stock: 0,
            }),
        },
    ];

    test("uses client validation for guest cart and reports issues", () => {
        const {result} = renderHook(() =>
            useCartValidationController(items, {isAuthenticated: false}),
        );

        expect(testCtx.validateQueryMock).toHaveBeenCalledWith(
            {locale: "en", currency: "USD"},
            {
                skip: true,
                pollingInterval: 60_000,
            },
        );
        expect(result.current.derived.hasIssues).toBe(true);
        expect(result.current.actions.getItemValidation("p1")?.issues).toEqual([
            "Only 2 available (you have 5)",
        ]);
        expect(result.current.actions.getItemValidation("p2")?.issues).toEqual([
            "This product is out of stock",
        ]);
    });

    test("prefers server validation for authenticated users when available", () => {
        const serverValidation: CartValidationItem[] = [
            {
                cartItemId: "c1",
                productId: "p1",
                requestedQuantity: 5,
                availableQuantity: 10,
                isValid: true,
                issues: [],
            },
            {
                cartItemId: "c2",
                productId: "p2",
                requestedQuantity: 1,
                availableQuantity: 0,
                isValid: false,
                issues: ["Server says unavailable"],
            },
        ];

        testCtx.validateQueryMock.mockReturnValue({
            data: serverValidation,
            isLoading: true,
        });

        const {result} = renderHook(() =>
            useCartValidationController(items, {isAuthenticated: true}),
        );

        expect(testCtx.validateQueryMock).toHaveBeenCalledWith(
            {locale: "en", currency: "USD"},
            {
                skip: false,
                pollingInterval: 60_000,
            },
        );
        expect(result.current.status.isValidating).toBe(true);
        expect(result.current.actions.getItemValidation("p1")).toEqual({
            productId: "p1",
            issues: [],
            isValid: true,
        });
        expect(result.current.actions.getItemValidation("p2")).toEqual({
            productId: "p2",
            issues: ["Server says unavailable"],
            isValid: false,
        });
        expect(result.current.derived.hasIssues).toBe(true);
    });
});
