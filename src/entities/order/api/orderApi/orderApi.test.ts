import {configureStore} from "@reduxjs/toolkit";
import {afterEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {orderApi} from "./orderApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

const mockOrderResponse = {
    id: "order-1",
    orderNumber: "ORD-2026-0001",
    status: "PROCESSING",
    paymentStatus: "PAID",
    paymentCardBrand: "visa",
    paymentCardLast4: "4242",
    totalAmount: 177.9,
    shippingAmount: 10,
    taxAmount: 8,
    discountAmount: 5,
    tipAmount: 3,
    couponCode: "SAVE5",
    currency: "usd",
    shippingAddress: {
        streetAddress: "Main street 1",
        city: "Kyiv",
        country: "UA",
        numberOfApartment: "1",
        zipCode: "01001",
    },
    deliveryDate: "2026-03-24T00:00:00.000Z",
    deliveryTime: "18:00",
    createdAt: "2026-03-24T01:00:00.000Z",
    updatedAt: "2026-03-24T01:20:00.000Z",
    orderItems: [
        {
            id: "oi-1",
            productId: "p-1",
            quantity: 2,
            price: 35.5,
            total: 71,
            productName: "Wireless Mouse",
            productImage: "https://picsum.photos/1",
            productSlug: "wireless-mouse",
            product: {
                id: "p-1",
                name: "Wireless Mouse",
                description: "Ergonomic wireless mouse",
                shortDescription: "Ergonomic mouse",
                slug: "wireless-mouse",
                price: 35.5,
                oldPrice: 45,
                stock: 10,
                categoryId: "cat-1",
                slugMap: {en: "wireless-mouse", de: "wireless-mouse"},
                images: [
                    {
                        url: "https://picsum.photos/1",
                        alt: "Mouse",
                        isMain: true,
                    },
                ],
            },
        },
    ],
    timeline: {
        currentStatus: "PROCESSING",
        promisedDeliveryAt: "2026-03-24T18:00:00.000Z",
        hasPromisedDelivery: true,
        events: [
            {
                status: "CONFIRMED",
                startedAt: "2026-03-24T00:30:00.000Z",
                plannedEndAt: "2026-03-24T01:30:00.000Z",
                state: "done",
            },
            {
                status: "PROCESSING",
                startedAt: "2026-03-24T01:30:00.000Z",
                plannedEndAt: "2026-03-24T05:30:00.000Z",
                state: "active",
            },
            {
                status: "SHIPPED",
                startedAt: "2026-03-24T05:30:00.000Z",
                plannedEndAt: "2026-03-24T17:30:00.000Z",
                state: "overdue",
            },
            {
                status: "DELIVERED",
                startedAt: "2026-03-24T17:30:00.000Z",
                plannedEndAt: "2026-03-24T18:00:00.000Z",
                state: "upcoming",
            },
        ],
    },
};

describe("entities/orderApi", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("getOrderById requests /orders/:id with locale", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/orders/order-1");
            expect(requestUrl).toContain("locale=en");

            return new Response(JSON.stringify(mockOrderResponse), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            orderApi.endpoints.getOrderById.initiate({
                orderId: "order-1",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data?.id).toBe("order-1");
        expect(result.data?.totalAmount).toBe(177.9);
        expect(result.data?.paymentCardBrand).toBe("visa");
        expect(result.data?.paymentCardLast4).toBe("4242");
        expect(result.data?.shippingAddress?.country).toBe("UA");
        expect(result.data?.orderItems[0]?.price).toBe(35.5);
        expect(result.data?.orderItems[0]?.total).toBe(71);
    });
});
