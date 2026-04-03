import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {mockGeocodeLondon} from "@/entities/shipping-address/api/test/mockData.ts";

import {saveShippingAddressActions} from "../../../model/slice/saveShippingAddressSlice.ts";

import {useMap} from "./useMap.ts";

const testCtx = vi.hoisted(() => ({
    mockState: undefined as Partial<StateSchema> | undefined,
    dispatchMock: vi.fn(),
    mockUserLocation: undefined as [number, number] | undefined,
    mockGeocodeData: undefined as
        | {
              label: string;
              country: string;
              city: string;
              postcode?: string;
              street?: string;
              housenumber?: string;
              name?: string;
          }
        | undefined,
}));

vi.mock("react-i18next", async () => {
    const actual = await vi.importActual<typeof import("react-i18next")>("react-i18next");

    return {
        ...actual,
        useTranslation: () => ({
            i18n: {language: "en"},
        }),
    };
});

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
    useAppSelector: (selector: (state: StateSchema) => unknown) =>
        selector(testCtx.mockState as StateSchema),
}));

vi.mock("@/shared/lib/browser", () => ({
    useUserLocation: () => ({
        location: testCtx.mockUserLocation,
    }),
}));

vi.mock("../../../api/saveShippingAddressApi.ts", () => ({
    useGetReverseGeocodeQuery: vi.fn(() => ({
        data: testCtx.mockGeocodeData,
        isFetching: false,
        isError: false,
    })),
}));

describe("useMap", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        testCtx.mockState = {
            saveShippingAddress: {
                mode: "add",
                editingAddressId: undefined,
                form: {
                    city: "",
                    streetAddress: "",
                    numberOfApartment: "12A",
                    zipCode: "",
                },
                location: [51.505, -0.09],
                isManageShippingAddressModalOpen: false,
            },
        } as Partial<StateSchema>;

        testCtx.mockUserLocation = undefined;
        testCtx.mockGeocodeData = undefined;
    });

    test("does not overwrite manual map selection when geolocation resolves later", () => {
        const {result, rerender} = renderHook(() => useMap());

        act(() => {
            result.current.actions.setLocationFromMap([40.1, -73.2]);
        });

        testCtx.mockState = {
            ...testCtx.mockState,
            saveShippingAddress: {
                ...testCtx.mockState!.saveShippingAddress!,
                location: [40.1, -73.2],
            },
        };
        rerender();

        testCtx.mockUserLocation = [49.84, 24.03];
        rerender();

        expect(testCtx.dispatchMock).toHaveBeenCalledWith(
            saveShippingAddressActions.setLocation([40.1, -73.2]),
        );
        expect(testCtx.dispatchMock).not.toHaveBeenCalledWith(
            saveShippingAddressActions.setLocation([49.84, 24.03]),
        );
    });

    test("maps reverse geocode data into form fields and preserves apartment", () => {
        testCtx.mockGeocodeData = {
            ...mockGeocodeLondon,
            street: "Baker Street",
            housenumber: "221B",
            postcode: "NW1",
        };

        renderHook(() => useMap());

        expect(testCtx.dispatchMock).toHaveBeenCalledWith(
            saveShippingAddressActions.setForm({
                city: "London",
                streetAddress: "221B, Baker Street",
                zipCode: "NW1",
                numberOfApartment: "12A",
            }),
        );
    });
});
