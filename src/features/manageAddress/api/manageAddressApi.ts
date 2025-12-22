import type { LatLngTuple } from "leaflet";

import { baseAPI } from "@/shared/api/rtk/baseAPI";

import type {
  AddressSearchResult,
  CreateShippingAddress,
  ReverseGeocodeResult,
  ShippingAddress,
  UpdateShippingAddress,
} from "../model/types/Address";

export const manageAddressApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    searchAddresses: build.query<
      AddressSearchResult[],
      { searchQuery: string; limit?: number; locale: string }
    >({
      query: ({ searchQuery, limit = 5, locale }) => ({
        url: "/shipping-addresses/search",
        params: { searchQuery, limit, locale },
      }),
    }),
    getReverseGeocode: build.query<
      ReverseGeocodeResult,
      { coords: LatLngTuple; locale: string }
    >({
      query: ({ coords, locale }) => ({
        url: "/shipping-addresses/reverse-geocode",
        params: {
          lat: coords[0],
          lon: coords[1],
          locale,
        },
      }),
    }),
    createShippingAddress: build.mutation<
      ShippingAddress,
      CreateShippingAddress
    >({
      query: (body) => ({
        url: "/shipping-addresses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    editShippingAddress: build.mutation<
      ShippingAddress,
      { body: UpdateShippingAddress; id: string }
    >({
      query: ({ body, id }) => ({
        url: `/shipping-addresses/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    deleteShippingAddress: build.mutation<ShippingAddress[], { id: string }>({
      query: ({ id }) => ({
        url: `/shipping-addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShippingAddress"],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        let wasDefault = false;
        let newDefaultAddress: ShippingAddress | undefined = undefined;

        const patchResult = dispatch(
          manageAddressApi.util.updateQueryData(
            "getShippingAddresses",
            undefined,
            (draft) => {
              const index = draft.findIndex((addr) => addr.id === id);
              if (index !== -1) {
                wasDefault = draft[index].isDefault;
                draft.splice(index, 1);

                if (wasDefault && draft.length > 0) {
                  draft[0].isDefault = true;
                  newDefaultAddress = JSON.parse(JSON.stringify(draft[0]));
                }
              }
            }
          )
        );

        if (wasDefault) {
          dispatch(
            manageAddressApi.util.updateQueryData(
              "getDefaultShippingAddress",
              undefined,
              () => newDefaultAddress
            )
          );
        }

        try {
          const { data: freshAddressList } = await queryFulfilled;

          dispatch(
            manageAddressApi.util.updateQueryData(
              "getShippingAddresses",
              undefined,
              () => freshAddressList
            )
          );

          const realNewDefault = freshAddressList.find(
            (addr) => addr.isDefault
          );
          dispatch(
            manageAddressApi.util.updateQueryData(
              "getDefaultShippingAddress",
              undefined,
              () => realNewDefault
            )
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    getShippingAddresses: build.query<ShippingAddress[], void>({
      query: () => ({
        url: "/shipping-addresses",
      }),
      providesTags: (result = []) => [
        "ShippingAddress",
        ...result.map(({ id }) => ({ type: "ShippingAddress" as const, id })),
      ],
    }),
    getDefaultShippingAddress: build.query<ShippingAddress, void>({
      query: () => ({
        url: "/shipping-addresses/default",
      }),
      providesTags: ["ShippingAddress"],
    }),
    setDefaultShippingAddress: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/shipping-addresses/${id}/set-default`,
        method: "PATCH",
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        let plainAddress: ShippingAddress | undefined;

        const patchResult = dispatch(
          manageAddressApi.util.updateQueryData(
            "getShippingAddresses",
            undefined,
            (draft) => {
              draft.forEach((address) => {
                address.isDefault = false;
              });

              const selectedAddress = draft.find((addr) => addr.id === id);
              if (selectedAddress) {
                selectedAddress.isDefault = true;
                plainAddress = JSON.parse(JSON.stringify(selectedAddress));
              }
            }
          )
        );

        if (plainAddress) {
          dispatch(
            manageAddressApi.util.upsertQueryData(
              "getDefaultShippingAddress",
              undefined,
              plainAddress
            )
          );
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useLazyGetDefaultShippingAddressQuery,
  useSearchAddressesQuery,
  useGetReverseGeocodeQuery,
  useCreateShippingAddressMutation,
  useSetDefaultShippingAddressMutation,
  useGetShippingAddressesQuery,
  useEditShippingAddressMutation,
  useGetDefaultShippingAddressQuery,
  useDeleteShippingAddressMutation,
} = manageAddressApi;
