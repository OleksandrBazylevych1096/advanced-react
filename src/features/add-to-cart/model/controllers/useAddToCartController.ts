import {useCallback, useEffect, useRef, useState} from "react";

import {
    broadcastCartUpdate,
    cartActions,
    type GuestCartItem,
    selectGuestCartItemByProductId,
    setGuestCart,
    useGetCartQuery,
} from "@/entities/cart";
import type {Product} from "@/entities/product";
import {selectIsAuthenticated} from "@/entities/user";

import {
    createControllerResult,
    useAppDispatch,
    useAppSelector,
    useAppStore,
    useToast,
} from "@/shared/lib";
import {debounceCallback} from "@/shared/lib/async/debounce/debounceCallback";

import {useAddToCartMutation} from "../../api/addToCartApi";

const DEBOUNCE_MS = 400;

export const useAddToCartController = (product: Product) => {
    const dispatch = useAppDispatch();
    const store = useAppStore();
    const toast = useToast();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [pendingCount, setPendingCount] = useState(0);

    const flushDebounceRef = useRef(debounceCallback(DEBOUNCE_MS));
    const pendingQuantityRef = useRef(0);
    const isMutatingRef = useRef(false);

    const guestExistingItem = useAppSelector((state) =>
        selectGuestCartItemByProductId(state, product.id),
    );

    const {data: serverCart} = useGetCartQuery(undefined, {skip: !isAuthenticated});
    const [addToCartMutation] = useAddToCartMutation();

    const serverQuantity =
        serverCart?.items.find(
            (item) => item.productId === product.id || item.product.id === product.id,
        )?.quantity ?? 0;

    const currentQuantity = isAuthenticated ? serverQuantity : (guestExistingItem?.quantity ?? 0);

    const prevServerQuantityRef = useRef(serverQuantity);

    useEffect(() => {
        if (isAuthenticated && serverQuantity > prevServerQuantityRef.current) {
            setPendingCount(0);
        }
        prevServerQuantityRef.current = serverQuantity;
    }, [isAuthenticated, serverQuantity]);

    const syncGuestStorage = useCallback(() => {
        const nextGuestItems = store.getState().cart.guestItems;
        setGuestCart(nextGuestItems);
        broadcastCartUpdate(nextGuestItems);
    }, [store]);

    const flushPending = useCallback(async () => {
        if (!isAuthenticated || isMutatingRef.current) return;

        const quantityToSend = pendingQuantityRef.current;
        if (quantityToSend <= 0) return;

        pendingQuantityRef.current = 0;
        isMutatingRef.current = true;

        try {
            await addToCartMutation({
                productId: product.id,
                quantity: quantityToSend,
            }).unwrap();
        } catch {
            toast.error("Failed to add item to cart");
            pendingQuantityRef.current = quantityToSend;
            setPendingCount(quantityToSend);
        } finally {
            isMutatingRef.current = false;

            if (pendingQuantityRef.current > 0) {
                flushDebounceRef.current.run(() => {
                    void flushPending();
                });
            }
        }
    }, [addToCartMutation, isAuthenticated, product.id, toast]);

    const runFlushDebounced = useCallback(() => {
        flushDebounceRef.current.run(() => {
            void flushPending();
        });
    }, [flushPending]);

    const addToCartAsUser = useCallback(
        (quantity: number) => {
            pendingQuantityRef.current += quantity;
            setPendingCount(pendingQuantityRef.current);
            runFlushDebounced();
        },
        [runFlushDebounced],
    );

    const addToCartAsGuest = useCallback(
        (quantity: number) => {
            const guestItem: GuestCartItem = {
                productId: product.id,
                quantity,
                product,
                addedAt: Date.now(),
            };

            dispatch(cartActions.addItem(guestItem));
            syncGuestStorage();
        },
        [dispatch, product, syncGuestStorage],
    );

    useEffect(() => {
        const debounce = flushDebounceRef.current;
        return () => {
            debounce.cancel();
        };
    }, []);

    const addToCart = useCallback(
        (quantity: number = 1) => {
            if (quantity <= 0) return;

            const availableToAdd = Math.max(
                product.stock - currentQuantity - pendingQuantityRef.current,
                0,
            );
            const clampedQuantity = Math.min(quantity, availableToAdd);
            if (clampedQuantity <= 0) return;

            if (isAuthenticated) {
                addToCartAsUser(clampedQuantity);
            } else {
                addToCartAsGuest(clampedQuantity);
            }
        },
        [addToCartAsGuest, addToCartAsUser, currentQuantity, isAuthenticated, product.stock],
    );

    return createControllerResult({
        data: {
            pendingCount,
            existingQuantity: currentQuantity,
        },
        actions: {
            addToCart,
        },
    });
};
