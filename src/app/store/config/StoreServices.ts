import {createCartQuantityCoordinator} from "@/features/update-cart-item-quantity";

export interface StoreServices {
    cartQuantityCoordinator: ReturnType<typeof createCartQuantityCoordinator>;
}

export const createStoreServices = (): StoreServices => ({
    cartQuantityCoordinator: createCartQuantityCoordinator(),
});
