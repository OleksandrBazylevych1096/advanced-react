import {createCartQuantityCoordinator} from "@/features/cart/update-item-quantity";

export interface StoreServices {
    cartQuantityCoordinator: ReturnType<typeof createCartQuantityCoordinator>;
}

export const createStoreServices = (): StoreServices => ({
    cartQuantityCoordinator: createCartQuantityCoordinator(),
});
