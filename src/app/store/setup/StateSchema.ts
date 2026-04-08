import type {Action, EnhancedStore, Reducer, ReducersMapObject} from "@reduxjs/toolkit";

import type {ApplyCouponSchema} from "@/features/apply-coupon";
import type {ChooseDeliveryTipSchema} from "@/features/choose-delivery-tip";
import type {ProductFiltersSchema} from "@/features/product-filters";
import type {ProductSearchSchema} from "@/features/product-search";

import type {CartSchema} from "@/entities/cart";
import type {SaveShippingAddressSchema} from "@/entities/shipping-address";
import type {UserSchema} from "@/entities/user";

import type {baseAPI} from "@/shared/api";
import type {ToastSchema} from "@/shared/lib/notifications";

import type {AppDispatch} from "./store";
import type {StoreServices} from "./StoreServices";

export interface StateSchema {
    user: UserSchema;
    toast: ToastSchema;
    cart: CartSchema;
    [baseAPI.reducerPath]: ReturnType<typeof baseAPI.reducer>;

    // Async reducers
    saveShippingAddress?: SaveShippingAddressSchema;
    productFilters?: ProductFiltersSchema;
    productSearch?: ProductSearchSchema;
    chooseDeliveryTip?: ChooseDeliveryTipSchema;
    applyCoupon?: ApplyCouponSchema;
}

export type StateSchemaKey = keyof StateSchema;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: (state: StateSchema | undefined, action: Action) => StateSchema;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
    getMountedReducers: () => Partial<Record<StateSchemaKey, boolean>>;
}

export interface AppStore extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
    dispatch: AppDispatch;
    services: StoreServices;
}
