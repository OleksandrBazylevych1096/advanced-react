import {applyCartItemQuantityChange, applyCartOptimisticUpdate} from "@/entities/cart";

import {baseAPI} from "@/shared/api";
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
            async onQueryStarted(productId, {dispatch, queryFulfilled}) {
                const version = versionGuard.next(productId);

                await runOptimisticTxn(
                    {
                        apply: () =>
                            applyCartOptimisticUpdate(dispatch, (draft) => {
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
