import {type ApiLocaleParams, baseAPI} from "@/shared/api";

import type {
    AvailableDeliveryDate,
    DeliverySelection,
} from "../model/types/availableDeliveryDateTypes";

interface DeliverySlotsResponse {
    availableDates: AvailableDeliveryDate[];
}

interface GetDeliverySlotsParams extends ApiLocaleParams {
    addressId: string;
    days?: number;
}

interface SetDeliverySlotRequest extends ApiLocaleParams {
    deliveryDate: string;
    deliveryTime: string;
    addressId?: string;
}

export const chooseDeliveryDateApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getDeliverySlots: build.query<DeliverySlotsResponse, GetDeliverySlotsParams>({
            query: ({addressId, days = 7, locale}) => ({
                url: "/delivery-selection/slots",
                params: {addressId, days, locale},
            }),
            providesTags: ["DeliverySelection"],
        }),

        getDeliverySelection: build.query<DeliverySelection | null, ApiLocaleParams>({
            query: ({locale}) => ({
                url: "/delivery-selection",
                params: {locale},
            }),
            providesTags: ["DeliverySelection"],
        }),

        setDeliverySlot: build.mutation<DeliverySelection, SetDeliverySlotRequest>({
            query: ({locale, ...body}) => ({
                url: "/delivery-selection",
                method: "PATCH",
                body,
                params: {locale},
            }),
            invalidatesTags: ["DeliverySelection"],
        }),
    }),
});

export const {useGetDeliverySlotsQuery, useGetDeliverySelectionQuery, useSetDeliverySlotMutation} =
    chooseDeliveryDateApi;
