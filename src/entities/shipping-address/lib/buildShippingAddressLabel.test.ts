import {describe, expect, test} from "vitest";

import {buildShippingAddressLabel} from "./buildShippingAddressLabel";

describe("buildShippingAddressLabel", () => {
    test("returns fallback when address is missing", () => {
        expect(buildShippingAddressLabel(undefined, "Address not specified")).toBe(
            "Address not specified",
        );
    });

    test("builds label with apartment when present", () => {
        expect(
            buildShippingAddressLabel(
                {
                    streetAddress: "Main st 1",
                    city: "Boston",
                    zipCode: "02118",
                    numberOfApartment: "12",
                },
                "Address not specified",
            ),
        ).toBe("apt. №12, Main st 1, Boston, 02118");
    });

    test("builds label without apartment when absent", () => {
        expect(
            buildShippingAddressLabel(
                {
                    streetAddress: "Main st 1",
                    city: "Boston",
                    zipCode: "02118",
                    numberOfApartment: "",
                },
                "Address not specified",
            ),
        ).toBe("Main st 1, Boston, 02118");
    });
});
