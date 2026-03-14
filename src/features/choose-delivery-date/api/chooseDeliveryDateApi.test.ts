import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {baseAPI} from "@/shared/api";
import {getRequestUrl} from "@/shared/lib/testing/http/requestUrl";

import {chooseDeliveryDateApi} from "./chooseDeliveryDateApi";

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("chooseDeliveryDateApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getDeliverySlots requests /delivery-selection/slots with addressId and days", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/delivery-selection/slots");
            expect(requestUrl).toContain("addressId=addr-1");
            expect(requestUrl).toContain("days=5");
            expect(requestUrl).toContain("locale=en");

            return new Response(
                JSON.stringify({
                    availableDates: [{date: "2026-03-12", slots: ["10:00"]}],
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            chooseDeliveryDateApi.endpoints.getDeliverySlots.initiate({
                addressId: "addr-1",
                days: 5,
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            availableDates: [{date: "2026-03-12", slots: ["10:00"]}],
        });
    });

    test("getDeliverySelection requests /delivery-selection", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
            const requestUrl = getRequestUrl(input);
            expect(requestUrl).toContain("/delivery-selection");
            expect(requestUrl).toContain("locale=en");

            return new Response(
                JSON.stringify({
                    deliveryDate: "2026-03-20",
                    deliveryTime: "18:00",
                }),
                {
                    status: 200,
                    headers: {"Content-Type": "application/json"},
                },
            );
        });

        const store = createApiStore();
        const result = await store.dispatch(
            chooseDeliveryDateApi.endpoints.getDeliverySelection.initiate({locale: "en"}),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            deliveryDate: "2026-03-20",
            deliveryTime: "18:00",
        });
    });

    test("setDeliverySlot patches /delivery-selection with selected date and time", async () => {
        const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
            const requestUrl = getRequestUrl(input);
            const requestMethod =
                input instanceof Request ? input.method : (init?.method ?? "GET");

            if (requestUrl.includes("/delivery-selection") && requestMethod === "PATCH") {
                expect(requestUrl).toContain("locale=en");
                const bodyText =
                    input instanceof Request
                        ? await input.clone().text()
                        : String(init?.body ?? "{}");
                const body = JSON.parse(bodyText) as {
                    deliveryDate: string;
                    deliveryTime: string;
                    addressId?: string;
                };

                expect(body).toEqual({
                    deliveryDate: "2026-03-20",
                    deliveryTime: "18:00",
                    addressId: "addr-1",
                });

                return new Response(
                    JSON.stringify({
                        deliveryDate: body.deliveryDate,
                        deliveryTime: body.deliveryTime,
                    }),
                    {
                        status: 200,
                        headers: {"Content-Type": "application/json"},
                    },
                );
            }

            return new Response(JSON.stringify({availableDates: []}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        const result = await store.dispatch(
            chooseDeliveryDateApi.endpoints.setDeliverySlot.initiate({
                deliveryDate: "2026-03-20",
                deliveryTime: "18:00",
                addressId: "addr-1",
                locale: "en",
            }),
        );

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual({
            deliveryDate: "2026-03-20",
            deliveryTime: "18:00",
        });
    });
});

