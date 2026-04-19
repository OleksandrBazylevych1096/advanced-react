import type {BrowserContext, Route} from "@playwright/test";

import {
    mockInvalidCouponResponse,
    mockValidCouponResponse,
} from "@/features/apply-coupon/config/test/mockData";

import {OrderStatus} from "@/entities/order/model/types/order";
import {mockMfaChallenge} from "@/entities/user/config/test/mockData";

import {
    type ApiScenario,
    createCartResponse,
    createCheckoutSummary,
    createOrderFromScenario,
    createProductsResponse,
    createPaymentSessionResponse,
} from "./scenario";

type JsonObject = {[key: string]: unknown};

const createCorsHeaders = async (route: Route): Promise<Record<string, string>> => {
    const origin = (await route.request().headerValue("origin")) ?? "http://127.0.0.1:4173";
    const requestHeaders =
        (await route.request().headerValue("access-control-request-headers")) ?? "content-type";

    return {
        "access-control-allow-origin": origin,
        "access-control-allow-credentials": "true",
        "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
        "access-control-allow-headers": requestHeaders,
    };
};

const fulfillJson = async (route: Route, body: unknown, status: number = 200): Promise<void> => {
    await route.fulfill({
        status,
        headers: {
            ...(await createCorsHeaders(route)),
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
    });
};

const parseRequestBody = (route: Route): JsonObject => {
    const rawBody = route.request().postData();

    if (!rawBody) {
        return {};
    }

    try {
        const parsedBody: unknown = JSON.parse(rawBody);
        return isJsonObject(parsedBody) ? parsedBody : {};
    } catch {
        return {};
    }
};

const isJsonObject = (value: unknown): value is JsonObject => {
    return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isString = (value: unknown): value is string => {
    return typeof value === "string";
};

const isNumber = (value: unknown): value is number => {
    return typeof value === "number";
};

const parseOptionalTipAmount = (value: string | null): number | undefined => {
    if (value === null) {
        return undefined;
    }

    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const getProductById = (
    scenario: ApiScenario,
    productId: string,
): ApiScenario["products"][number] | undefined => {
    return scenario.products.find((product) => product.id === productId);
};

const getProductBySlug = (
    scenario: ApiScenario,
    productSlug: string,
): ApiScenario["products"][number] | undefined => {
    return scenario.products.find(
        (product) =>
            product.slug === productSlug || Object.values(product.slugMap).includes(productSlug),
    );
};

const getCategoryById = (
    scenario: ApiScenario,
    categoryId: string,
): ApiScenario["categories"][number] | undefined => {
    return scenario.categories.find((category) => category.id === categoryId);
};

const getCategoryBySlug = (
    scenario: ApiScenario,
    categorySlug: string,
): ApiScenario["categories"][number] | undefined => {
    return scenario.categories.find(
        (category) =>
            category.slug === categorySlug ||
            Object.values(category.slugMap).includes(categorySlug),
    );
};

const upsertCartItem = (
    cartItems: ApiScenario["cartItems"],
    product: ApiScenario["products"][number],
    quantity: number,
): ApiScenario["cartItems"] => {
    const existingItem = cartItems.find((item) => item.product.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
        return cartItems;
    }

    return [
        ...cartItems,
        {
            id: `ci-${cartItems.length + 1}`,
            quantity,
            product,
        },
    ];
};

const buildCheckoutUrl = (successUrl: string, sessionId: string): string => {
    const url = new URL(successUrl);
    url.searchParams.set("sessionId", sessionId);

    return url.toString();
};

const handleCartAdd = async (route: Route, scenario: ApiScenario): Promise<void> => {
    const body = parseRequestBody(route);
    const productId = body.productId;
    const quantity = body.quantity;

    if (!isString(productId) || !isNumber(quantity)) {
        await fulfillJson(route, {error: "Invalid cart payload"}, 400);
        return;
    }

    const product = getProductById(scenario, productId);

    if (!product) {
        await fulfillJson(route, {error: "Product not found"}, 404);
        return;
    }

    scenario.cartItems = upsertCartItem(scenario.cartItems, product, quantity);
    await fulfillJson(route, createCartResponse(scenario));
};

const handleCartItemPatch = async (route: Route, scenario: ApiScenario): Promise<void> => {
    const productId = route.request().url().split("/").pop();
    const body = parseRequestBody(route);
    const quantity = body.quantity;

    if (!productId || !isNumber(quantity)) {
        await fulfillJson(route, {error: "Invalid cart update payload"}, 400);
        return;
    }

    scenario.cartItems = scenario.cartItems
        .map((item) => (item.product.id === productId ? {...item, quantity} : item))
        .filter((item) => item.quantity > 0);

    await fulfillJson(route, createCartResponse(scenario));
};

const handleCartItemDelete = async (route: Route, scenario: ApiScenario): Promise<void> => {
    const productId = route.request().url().split("/").pop();

    if (!productId) {
        await fulfillJson(route, {error: "Missing product id"}, 400);
        return;
    }

    scenario.cartItems = scenario.cartItems.filter((item) => item.product.id !== productId);
    await fulfillJson(route, {});
};

const handleDeliverySelectionPatch = async (route: Route, scenario: ApiScenario): Promise<void> => {
    const body = parseRequestBody(route);
    const deliveryDate = body.deliveryDate;
    const deliveryTime = body.deliveryTime;

    if (!isString(deliveryDate) || !isString(deliveryTime)) {
        await fulfillJson(route, {error: "Invalid delivery selection"}, 400);
        return;
    }

    scenario.deliverySelection = {
        deliveryDate,
        deliveryTime,
    };

    await fulfillJson(route, scenario.deliverySelection);
};

const handleCheckoutPaymentSession = async (route: Route, scenario: ApiScenario): Promise<void> => {
    if (scenario.paymentSessionFails) {
        await fulfillJson(route, {message: "Unable to create payment session"}, 500);
        return;
    }

    const body = parseRequestBody(route);
    const successUrl = body.successUrl;
    const couponCode = body.couponCode;
    const tipAmount = body.tipAmount;

    if (!isString(successUrl)) {
        await fulfillJson(route, {error: "Missing success URL"}, 400);
        return;
    }

    await fulfillJson(
        route,
        createPaymentSessionResponse(scenario, buildCheckoutUrl(successUrl, "sess_123"), {
            couponCode: isString(couponCode) ? couponCode : undefined,
            tipAmount: isNumber(tipAmount) ? tipAmount : undefined,
        }),
    );
};

const handleCancelOrder = async (route: Route, scenario: ApiScenario): Promise<void> => {
    const orderId = route.request().url().split("/").at(-2);

    if (!orderId) {
        await fulfillJson(route, {error: "Missing order id"}, 400);
        return;
    }

    if (!scenario.createdOrder || scenario.createdOrder.id !== orderId) {
        scenario.createdOrder = createOrderFromScenario(scenario, orderId);
    }

    scenario.createdOrder = {
        ...scenario.createdOrder,
        status: OrderStatus.CANCELLED,
        cancelledAt: "2026-03-24T02:00:00.000Z",
        updatedAt: "2026-03-24T02:00:00.000Z",
        timeline: [
            ...scenario.createdOrder.timeline.filter((event) => event.id !== "cancelled"),
            {
                id: "cancelled",
                status: OrderStatus.CANCELLED,
                timestamp: "2026-03-24T02:00:00.000Z",
                progress: 100,
            },
        ],
    };

    await fulfillJson(route, scenario.createdOrder);
};

const handleApiRequest = async (route: Route, scenario: ApiScenario): Promise<void> => {
    const request = route.request();
    const url = new URL(request.url());
    const pathname = url.pathname;
    const method = request.method();
    if (method === "OPTIONS") {
        await route.fulfill({
            status: 204,
            headers: await createCorsHeaders(route),
        });
        return;
    }

    if (pathname === "/auth/refresh" && method === "POST") {
        if (scenario.refreshSessionFails) {
            await fulfillJson(route, {message: "Session expired"}, 401);
            return;
        }

        await fulfillJson(route, {
            ...scenario.authSession,
        });
        return;
    }

    if (pathname === "/auth/login" && method === "POST") {
        if (scenario.loginMode === "mfa") {
            await fulfillJson(route, mockMfaChallenge);
            return;
        }

        await fulfillJson(route, scenario.authSession);
        return;
    }

    if (pathname === "/promo-banners/active" && method === "GET") {
        await fulfillJson(
            route,
            scenario.products.map((product) => product.images[0]?.url ?? ""),
        );
        return;
    }

    if (pathname === "/categories/navigation" && method === "GET") {
        await fulfillJson(route, {
            currentCategory: null,
            parentCategory: null,
            items: [
                {
                    id: "cat-fruits",
                    name: "Fruits",
                    slug: "fruits",
                    slugMap: {en: "fruits", de: "fruits"},
                    parentId: null,
                },
                {
                    id: "cat-dairy",
                    name: "Dairy",
                    slug: "dairy",
                    slugMap: {en: "dairy", de: "dairy"},
                    parentId: null,
                },
            ],
            isShowingSubcategories: false,
        });
        return;
    }

    if (pathname === "/products/best-sellers" && method === "GET") {
        await fulfillJson(route, createProductsResponse(scenario));
        return;
    }

    if (pathname === "/products/first-order-discount" && method === "GET") {
        await fulfillJson(route, scenario.products);
        return;
    }

    if (pathname === "/tags/popular" && method === "GET") {
        await fulfillJson(route, [
            {id: "tag-trending", name: "Trending", slug: "trending"},
            {id: "tag-fresh", name: "Fresh", slug: "fresh"},
        ]);
        return;
    }

    if (pathname === "/products" && method === "GET") {
        await fulfillJson(route, createProductsResponse(scenario));
        return;
    }

    if (pathname.startsWith("/products/slug/") && method === "GET") {
        const slug = pathname.split("/").pop();
        const product = slug ? getProductBySlug(scenario, slug) : undefined;

        if (!product) {
            await fulfillJson(route, {error: "Product not found"}, 404);
            return;
        }

        await fulfillJson(route, product);
        return;
    }

    if (pathname.startsWith("/categories/slug/") && method === "GET") {
        const slug = pathname.split("/").pop();
        const category = slug ? getCategoryBySlug(scenario, slug) : undefined;

        if (!category) {
            await fulfillJson(route, {error: "Category not found"}, 404);
            return;
        }

        await fulfillJson(route, category);
        return;
    }

    if (pathname.startsWith("/categories/breadcrumbs/") && method === "GET") {
        const categoryId = pathname.split("/").pop();
        const category = categoryId ? getCategoryById(scenario, categoryId) : undefined;

        if (!category) {
            await fulfillJson(route, [], 200);
            return;
        }

        await fulfillJson(route, [category]);
        return;
    }

    if (pathname.startsWith("/categories/") && method === "GET") {
        const categoryId = pathname.split("/").pop();
        const category = categoryId ? getCategoryById(scenario, categoryId) : undefined;

        if (!category) {
            await fulfillJson(route, {error: "Category not found"}, 404);
            return;
        }

        await fulfillJson(route, category);
        return;
    }

    if (pathname === "/shipping-addresses/default" && method === "GET") {
        if (scenario.missingDefaultAddress) {
            await fulfillJson(route, {message: "Default address not found"}, 404);
            return;
        }

        await fulfillJson(route, scenario.defaultAddress);
        return;
    }

    if (pathname === "/cart" && method === "GET") {
        await fulfillJson(route, createCartResponse(scenario));
        return;
    }

    if (pathname === "/cart/count" && method === "GET") {
        await fulfillJson(route, createCartResponse(scenario).totals.totalItems);
        return;
    }

    if (pathname === "/cart/validate" && method === "GET") {
        await fulfillJson(route, createCheckoutSummary(scenario).validation);
        return;
    }

    if (pathname === "/cart/add" && method === "POST") {
        await handleCartAdd(route, scenario);
        return;
    }

    if (pathname.startsWith("/cart/item/") && method === "PATCH") {
        await handleCartItemPatch(route, scenario);
        return;
    }

    if (pathname.startsWith("/cart/item/") && method === "DELETE") {
        await handleCartItemDelete(route, scenario);
        return;
    }

    if (pathname === "/cart/clear" && method === "DELETE") {
        scenario.cartItems = [];
        await fulfillJson(route, {});
        return;
    }

    if (pathname === "/delivery-selection/slots" && method === "GET") {
        await fulfillJson(route, {availableDates: scenario.deliveryDates});
        return;
    }

    if (pathname === "/delivery-selection" && method === "GET") {
        await fulfillJson(route, scenario.deliverySelection);
        return;
    }

    if (pathname === "/delivery-selection" && method === "PATCH") {
        await handleDeliverySelectionPatch(route, scenario);
        return;
    }

    if (pathname === "/checkout/summary" && method === "GET") {
        await fulfillJson(
            route,
            createCheckoutSummary(scenario, {
                couponCode: url.searchParams.get("couponCode"),
                tipAmount: parseOptionalTipAmount(url.searchParams.get("tipAmount")),
            }),
        );
        return;
    }

    if (pathname === "/checkout/validate-coupon" && method === "GET") {
        const couponCode = url.searchParams.get("couponCode");

        if (couponCode === mockValidCouponResponse.code) {
            await fulfillJson(route, mockValidCouponResponse);
            return;
        }

        await fulfillJson(route, {
            ...mockInvalidCouponResponse,
            code: couponCode ?? mockInvalidCouponResponse.code,
        });
        return;
    }

    if (pathname === "/checkout/payment-session" && method === "POST") {
        await handleCheckoutPaymentSession(route, scenario);
        return;
    }

    if (pathname.startsWith("/checkout/payment-session/") && method === "GET") {
        if (!scenario.checkoutSession) {
            await fulfillJson(route, {error: "Checkout session not found"}, 404);
            return;
        }

        await fulfillJson(route, scenario.checkoutSession);
        return;
    }

    if (pathname === "/orders/my-orders" && method === "GET") {
        const statuses = url.searchParams.getAll("status");
        const orders =
            statuses.length > 0
                ? scenario.settingsOrdersResponse.orders.filter((order) =>
                      statuses.includes(order.status),
                  )
                : scenario.settingsOrdersResponse.orders;

        await fulfillJson(route, {
            ...scenario.settingsOrdersResponse,
            orders,
            pagination: {
                ...scenario.settingsOrdersResponse.pagination,
                total: orders.length,
            },
        });
        return;
    }

    if (/^\/orders\/[^/]+\/cancel$/.test(pathname) && method === "POST") {
        await handleCancelOrder(route, scenario);
        return;
    }

    if (pathname.startsWith("/orders/") && method === "GET") {
        if (!scenario.createdOrder) {
            scenario.createdOrder = createOrderFromScenario(scenario, "order-1");
        }

        await fulfillJson(route, scenario.createdOrder);
        return;
    }

    if (pathname === "/auth/notifications/email" && method === "PATCH") {
        if (scenario.notificationsUpdateFails) {
            await fulfillJson(route, {message: "Something went wrong"}, 500);
            return;
        }

        const body = parseRequestBody(route);
        const enabled = body.enabled;

        if (typeof enabled !== "boolean") {
            await fulfillJson(route, {message: "Invalid notifications payload"}, 400);
            return;
        }

        await fulfillJson(route, {
            success: true,
            emailNotificationsEnabled: enabled,
        });
        return;
    }

    await fulfillJson(route, {error: `Unhandled API route: ${method} ${pathname}`}, 404);
};

export const registerApiMocks = async (
    context: BrowserContext,
    scenario: ApiScenario,
): Promise<void> => {
    await context.route(/^http:\/\/localhost:3000\/.*/, async (route) => {
        try {
            await handleApiRequest(route, scenario);
        } catch {
            await fulfillJson(route, {error: "Mock handler failed"}, 500);
        }
    });
};
