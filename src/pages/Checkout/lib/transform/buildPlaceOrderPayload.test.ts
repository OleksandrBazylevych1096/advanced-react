import {describe, expect, test} from "vitest";

import {buildPlaceOrderPayload} from "./buildPlaceOrderPayload";

describe("buildPlaceOrderPayload", () => {
    test("maps address and delivery selection to place-order payload", () => {
        const payload = buildPlaceOrderPayload(
            {
                id: "addr-1",
                streetAddress: "Main st 1",
                city: "Boston",
                zipCode: "02118",
                numberOfApartment: "12A",
                isDefault: true,
                latitude: 0,
                longitude: 0,
            },
            {
                deliveryDate: "2026-03-14",
                deliveryTime: "10:00",
            },
        );

        expect(payload).toEqual({
            shippingAddress: "Main st 1",
            shippingCity: "Boston",
            shippingCountry: "US",
            shippingPostal: "02118",
            shippingNumberOfApartment: "12A",
            billingAddress: "Main st 1",
            billingCity: "Boston",
            billingCountry: "US",
            billingPostal: "02118",
            paymentMethod: "stripe",
            deliveryDate: "2026-03-14",
            deliveryTime: "10:00",
        });
    });

    test("keeps delivery fields undefined when selection is absent", () => {
        const payload = buildPlaceOrderPayload(
            {
                id: "addr-1",
                streetAddress: "Main st 1",
                city: "Boston",
                zipCode: "02118",
                numberOfApartment: "",
                isDefault: true,
                latitude: 0,
                longitude: 0,
            },
            undefined,
        );

        expect(payload.deliveryDate).toBeUndefined();
        expect(payload.deliveryTime).toBeUndefined();
        expect(payload.shippingCountry).toBe("US");
        expect(payload.billingCountry).toBe("US");
    });
});
