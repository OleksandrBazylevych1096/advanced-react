import {CartQuantityService} from "@/features/update-cart-item-quantity";

export interface StoreServices {
    CartQuantityService: CartQuantityService;
}

export const createStoreServices = (): StoreServices => ({
    CartQuantityService: new CartQuantityService(),
});
