import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing/msw/createHandlers";

import {mockCart, mockCartValidation, mockCartValidationWithIssues} from "./mockData";

const getCartBase = createHandlers({
    endpoint: `${API_URL}/cart`,
    method: "get",
    defaultData: mockCart,
    errorData: {error: "Failed to load cart"},
    errorStatus: 500,
});

const validateCartBase = createHandlers({
    endpoint: `${API_URL}/cart/validate`,
    method: "get",
    defaultData: mockCartValidation,
    errorData: {error: "Failed to validate cart"},
    errorStatus: 500,
});

const clearCartBase = createHandlers({
    endpoint: `${API_URL}/cart/clear`,
    method: "delete",
    defaultData: {},
    errorData: {error: "Failed to clear cart"},
    errorStatus: 500,
});

const updateItemBase = createHandlers({
    endpoint: `${API_URL}/cart/item/:productId`,
    method: "patch",
    defaultData: {},
    errorData: {error: "Failed to update cart item"},
    errorStatus: 500,
});

const removeItemBase = createHandlers({
    endpoint: `${API_URL}/cart/item/:productId`,
    method: "delete",
    defaultData: {},
    errorData: {error: "Failed to remove cart item"},
    errorStatus: 500,
});

export const cartHandlers = {
    cart: extendHandlers(getCartBase, {
        empty: http.get(`${API_URL}/cart`, () =>
            HttpResponse.json({
                ...mockCart,
                items: [],
                totals: {...mockCart.totals, subtotal: 0, totalItems: 0, total: 0},
            }),
        ),
    }),
    validation: extendHandlers(validateCartBase, {
        withIssues: http.get(`${API_URL}/cart/validate`, () =>
            HttpResponse.json(mockCartValidationWithIssues),
        ),
    }),
    clearCart: clearCartBase,
    updateItem: updateItemBase,
    removeItem: removeItemBase,
};
