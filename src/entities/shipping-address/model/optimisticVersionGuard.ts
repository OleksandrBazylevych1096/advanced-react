import {createVersionGuard} from "@/shared/lib/state";

export const SHIPPING_ADDRESSES_DOMAIN_KEY = "shipping-addresses-domain";
export const shippingAddressOptimisticVersionGuard = createVersionGuard();
