import {baseAPI} from "@/shared/api";

import type {AvailableDeliveryDate} from "../model/types/availableDeliveryDateTypes";

interface DeliverySlotsResponse {
    availableDates: AvailableDeliveryDate[];
}

interface GetDeliverySlotsParams {
    addressId: string;
    days?: number;
}

interface SetDeliverySlotRequest {
    deliveryDate: string;
    deliveryTime: string;
    addressId?: string;
}

interface DeliverySelectionResponse {
    deliveryDate: string;
    deliveryTime: string;
}

export const chooseDeliveryDateApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        getDeliverySlots: build.query<DeliverySlotsResponse, GetDeliverySlotsParams>({
            query: ({addressId, days = 7}) => ({
                url: "/delivery-selection/slots",
                params: {addressId, days},
            }),
            providesTags: ["DeliverySelection"],
        }),

        getDeliverySelection: build.query<DeliverySelectionResponse | null, void>({
            query: () => ({
                url: "/delivery-selection",
            }),
            providesTags: ["DeliverySelection"],
        }),

        setDeliverySlot: build.mutation<DeliverySelectionResponse, SetDeliverySlotRequest>({
            query: (body) => ({
                url: "/delivery-selection",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["DeliverySelection"],
        }),
    }),
});

export const {
    useGetDeliverySlotsQuery,
    useGetDeliverySelectionQuery,
    useSetDeliverySlotMutation,
} = chooseDeliveryDateApi;
