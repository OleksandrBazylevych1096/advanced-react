import {mockSettingsOrdersListResponse} from "@/pages/settings/Orders/testing";

import {mockDeliveryDates} from "@/features/choose-delivery-date/testing";

import {mockCategories} from "@/entities/category/testing";
import {mockFacets, mockProducts} from "@/entities/product/testing";
import {mockSingleAddress} from "@/entities/shipping-address/testing";
import {mockAuthSession} from "@/entities/user/testing";

import {cloneValue} from "./cloneValue";
import {TEST_COUNTRY} from "./constants";
import type {ApiScenario, ApiScenarioOptions} from "./types";

const createScenarioCategories = (): ApiScenario["categories"] => {
    const categories = cloneValue(mockCategories);
    const [firstCategory, ...restCategories] = categories;

    if (!firstCategory) {
        return categories;
    }

    return [
        {
            ...firstCategory,
            slug: "fruits",
            slugMap: {
                en: "fruits",
                de: "obst",
            },
        },
        ...restCategories,
    ];
};

const createScenarioProducts = (categories: ApiScenario["categories"]): ApiScenario["products"] => {
    const products = cloneValue(mockProducts.slice(0, 3));
    const primaryCategory = categories[0];

    return products.map((product, index) => {
        const localizedSlugMap =
            index === 0
                ? {
                      en: product.slug,
                      de: "bio-bananen",
                  }
                : {
                      en: product.slug,
                      de: product.slug,
                  };

        return {
            ...product,
            categoryId: primaryCategory?.id ?? product.categoryId,
            slugMap: localizedSlugMap,
            images: product.images.map((image) => ({
                ...image,
                // Keep e2e deterministic and self-contained without external image requests.
                url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%25' height='100%25' fill='%23f4efe6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='%232c2c2c'>Item</text></svg>",
            })),
        };
    });
};

const createAuthScenario = (
    options: ApiScenarioOptions,
): Pick<ApiScenario, "authState" | "loginMode" | "refreshSessionFails" | "authSession"> => ({
    authState: options.authState ?? "authenticated",
    loginMode: options.loginMode ?? "success",
    refreshSessionFails: options.refreshSessionFails ?? false,
    authSession: cloneValue(mockAuthSession),
});

const createCatalogScenario = (): Pick<
    ApiScenario,
    "categories" | "products" | "productFacets"
> => {
    const categories = createScenarioCategories();

    return {
        categories,
        products: createScenarioProducts(categories),
        productFacets: cloneValue(mockFacets),
    };
};

const createCheckoutScenario = (): Pick<
    ApiScenario,
    | "paymentSessionFails"
    | "missingDefaultAddress"
    | "notificationsUpdateFails"
    | "cartItems"
    | "defaultAddress"
    | "defaultAddressCountry"
    | "deliveryDates"
    | "deliverySelection"
    | "createdOrder"
    | "checkoutSession"
> => ({
    paymentSessionFails: false,
    missingDefaultAddress: false,
    notificationsUpdateFails: false,
    cartItems: [],
    defaultAddress: {
        ...cloneValue(mockSingleAddress),
        streetAddress: "221B Baker Street",
        zipCode: "NW1 6XE",
        numberOfApartment: "5A",
    },
    defaultAddressCountry: TEST_COUNTRY,
    deliveryDates: cloneValue(mockDeliveryDates),
    deliverySelection: {
        deliveryDate: mockDeliveryDates[0]?.date ?? "2026-03-12",
        deliveryTime: mockDeliveryDates[0]?.slots[1] ?? "12:00",
    },
    createdOrder: null,
    checkoutSession: null,
});

const createOrdersScenario = (): Pick<ApiScenario, "settingsOrdersResponse"> => {
    return {
        settingsOrdersResponse: cloneValue(mockSettingsOrdersListResponse),
    };
};

export const createApiScenario = (options: ApiScenarioOptions = {}): ApiScenario => ({
    ...createAuthScenario(options),
    ...createCatalogScenario(),
    ...createCheckoutScenario(),
    ...createOrdersScenario(),
    paymentSessionFails: options.paymentSessionFails ?? false,
    missingDefaultAddress: options.missingDefaultAddress ?? false,
    notificationsUpdateFails: options.notificationsUpdateFails ?? false,
});
