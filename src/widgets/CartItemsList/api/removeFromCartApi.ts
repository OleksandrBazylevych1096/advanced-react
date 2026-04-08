import {applyCartItemQuantityChange, applyCartOptimisticUpdate} from "@/entities/cart";

import {baseAPI} from "@/shared/api";
import type {CurrencyType} from "@/shared/config";
import {i18n} from "@/shared/config";
import {isAbortError} from "@/shared/lib/errors";
import {createVersionGuard, runOptimisticTxn} from "@/shared/lib/state";

const versionGuard = createVersionGuard();

export const removeFromCartApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({
        removeFromCart: build.mutation<void, string>({
            query: (productId) => ({
                url: `/cart/item/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart", "CartValidation"],
            async onQueryStarted(productId, {dispatch, queryFulfilled, getState}) {
                const version = versionGuard.next(productId);
                const state = getState() as {user?: {currency?: CurrencyType}};
                const currency = state.user?.currency ?? "USD";
                const cartQueryArgs = {locale: i18n.language, currency};

                await runOptimisticTxn(
                    {
                        apply: () =>
                            applyCartOptimisticUpdate(dispatch, cartQueryArgs, (draft) => {
                                applyCartItemQuantityChange(draft, productId, 0);
                            }),
                        rollbackOnError: (error: unknown) =>
                            versionGuard.isCurrent(productId, version) && !isAbortError(error),
                        onError: (error: unknown) => {
                            if (isAbortError(error)) return;
                            if (!versionGuard.isCurrent(productId, version)) return;
                        },
                    },
                    async () => {
                        await queryFulfilled;
                    },
                );

                if (versionGuard.isCurrent(productId, version)) {
                    versionGuard.clear(productId);
                }
            },
        }),
    }),
});

export const {useRemoveFromCartMutation} = removeFromCartApi;
