import type {ShippingAddress} from "@/entities/shipping-address";
import {
    SHIPPING_ADDRESSES_DOMAIN_KEY,
    shippingAddressApi,
    shippingAddressOptimisticVersionGuard,
} from "@/entities/shipping-address";

import {baseAPI} from "@/shared/api";
import {isAbortError} from "@/shared/lib/errors";
import {toastActions} from "@/shared/lib/notifications";
import {runOptimisticTxn} from "@/shared/lib/state";

export const selectDefaultShippingAddressApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        setDefaultShippingAddress: build.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/shipping-addresses/${id}/set-default`,
                method: "PATCH",
            }),
            async onQueryStarted({id}, {dispatch, queryFulfilled}) {
                const version = shippingAddressOptimisticVersionGuard.next(
                    SHIPPING_ADDRESSES_DOMAIN_KEY,
                );

                await runOptimisticTxn(
                    {
                        apply: () => {
                            let nextDefault: ShippingAddress | undefined;

                            const listPatch = dispatch(
                                shippingAddressApi.util.updateQueryData(
                                    "getShippingAddresses",
                                    undefined,
                                    (draft) => {
                                        draft.forEach((address) => {
                                            address.isDefault = false;
                                        });

                                        const selectedAddress = draft.find(
                                            (addr) => addr.id === id,
                                        );
                                        if (selectedAddress) {
                                            selectedAddress.isDefault = true;
                                            nextDefault = {...selectedAddress};
                                        }
                                    },
                                ),
                            );

                            const defaultPatch = dispatch(
                                shippingAddressApi.util.updateQueryData(
                                    "getDefaultShippingAddress",
                                    undefined,
                                    (draft) => {
                                        if (!nextDefault) return;
                                        if (!draft) return nextDefault;
                                        Object.assign(draft, nextDefault);
                                    },
                                ),
                            );

                            return [listPatch, defaultPatch];
                        },
                        rollbackOnError: (error: unknown) =>
                            shippingAddressOptimisticVersionGuard.isCurrent(
                                SHIPPING_ADDRESSES_DOMAIN_KEY,
                                version,
                            ) && !isAbortError(error),
                        onError: (error: unknown) => {
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
                                    message: "Failed to set default address. Please try again.",
                                    type: "error",
                                }),
                            );
                        },
                    },
                    async () => {
                        await queryFulfilled;
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
            invalidatesTags: ["ShippingAddress", "DeliverySelection"],
        }),
    }),
});

export const {useSetDefaultShippingAddressMutation} = selectDefaultShippingAddressApi;
