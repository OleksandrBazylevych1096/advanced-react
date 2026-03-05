import {toastActions} from "@/app/providers";

import type {ShippingAddress} from "@/entities/shipping-address";
import {
    SHIPPING_ADDRESSES_DOMAIN_KEY,
    shippingAddressApi,
    shippingAddressOptimisticVersionGuard,
} from "@/entities/shipping-address";

import {baseAPI} from "@/shared/api/rtk/baseAPI";
import {isAbortError, runOptimisticTxn} from "@/shared/lib";

export const deleteShippingAddressApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        deleteShippingAddress: build.mutation<ShippingAddress[], {id: string}>({
            query: ({id}) => ({
                url: `/shipping-addresses/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted({id}, {dispatch, queryFulfilled}) {
                const version = shippingAddressOptimisticVersionGuard.next(
                    SHIPPING_ADDRESSES_DOMAIN_KEY,
                );

                let wasDefault = false;
                let nextDefaultAddress: ShippingAddress | undefined;

                await runOptimisticTxn(
                    {
                        apply: () => {
                            const addressListPatch = dispatch(
                                shippingAddressApi.util.updateQueryData(
                                    "getShippingAddresses",
                                    undefined,
                                    (draft) => {
                                        const index = draft.findIndex((addr) => addr.id === id);
                                        if (index === -1) return;

                                        wasDefault = draft[index].isDefault;
                                        draft.splice(index, 1);

                                        if (wasDefault && draft.length > 0) {
                                            draft[0].isDefault = true;
                                            nextDefaultAddress = {...draft[0]};
                                        }
                                    },
                                ),
                            );

                            const defaultAddressPatch = dispatch(
                                shippingAddressApi.util.updateQueryData(
                                    "getDefaultShippingAddress",
                                    undefined,
                                    (draft) => {
                                        if (!wasDefault) return;

                                        if (nextDefaultAddress) {
                                            if (!draft) return nextDefaultAddress;
                                            Object.assign(draft, nextDefaultAddress);
                                        }
                                    },
                                ),
                            );

                            return [addressListPatch, defaultAddressPatch];
                        },
                        rollbackOnError: (error) =>
                            shippingAddressOptimisticVersionGuard.isCurrent(
                                SHIPPING_ADDRESSES_DOMAIN_KEY,
                                version,
                            ) && !isAbortError(error),
                        onError: (error) => {
                            if (isAbortError(error)) return;
                            if (
                                !shippingAddressOptimisticVersionGuard.isCurrent(
                                    SHIPPING_ADDRESSES_DOMAIN_KEY,
                                    version,
                                )
                            )
                                return;

                            dispatch(
                                toastActions.addToast({
                                    message: "Failed to delete address. Please try again.",
                                    type: "error",
                                }),
                            );
                        },
                    },
                    async () => {
                        const {data: freshAddressList} = await queryFulfilled;
                        if (
                            !shippingAddressOptimisticVersionGuard.isCurrent(
                                SHIPPING_ADDRESSES_DOMAIN_KEY,
                                version,
                            )
                        )
                            return;

                        dispatch(
                            shippingAddressApi.util.updateQueryData(
                                "getShippingAddresses",
                                undefined,
                                () => freshAddressList,
                            ),
                        );

                        const realDefault = freshAddressList.find((addr) => addr.isDefault);
                        dispatch(
                            shippingAddressApi.util.updateQueryData(
                                "getDefaultShippingAddress",
                                undefined,
                                (draft) => {
                                    if (!realDefault) return;
                                    if (!draft) return realDefault;
                                    Object.assign(draft, realDefault);
                                },
                            ),
                        );
                    },
                );

                if (
                    shippingAddressOptimisticVersionGuard.isCurrent(
                        SHIPPING_ADDRESSES_DOMAIN_KEY,
                        version,
                    )
                ) {
                    shippingAddressOptimisticVersionGuard.clear(SHIPPING_ADDRESSES_DOMAIN_KEY);
                }
            },
        }),
    }),
});

export const {useDeleteShippingAddressMutation} = deleteShippingAddressApi;
