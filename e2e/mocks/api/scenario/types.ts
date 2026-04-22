import type {CheckoutSessionDetails} from "@/pages/CheckoutResult/model/types/checkoutResultTypes.ts";
import type {SettingsOrdersListResponse} from "@/pages/settings/Orders/model/types/settingsOrders.ts";

import type {
    AvailableDeliveryDate,
    DeliverySelection,
} from "@/features/choose-delivery-date/model/types/availableDeliveryDateTypes.ts";

import type {CartItem} from "@/entities/cart/model/types/CartSchema";
import type {Category} from "@/entities/category/model/types/Category.ts";
import type {OrderDetails, OrderStatusType} from "@/entities/order/model/types/order";
import type {Product, ProductFacets} from "@/entities/product/model/types/Product";
import type {ShippingAddress} from "@/entities/shipping-address/model/types/types";
import type {Tag} from "@/entities/tag";
import type {AuthSessionResponse} from "@/entities/user/model/types/AuthSession";

export interface ApiScenario {
    authState: "authenticated" | "guest";
    loginMode: "success" | "mfa";
    refreshSessionFails: boolean;
    paymentSessionFails: boolean;
    missingDefaultAddress: boolean;
    notificationsUpdateFails: boolean;
    authSession: AuthSessionResponse;
    categories: Category[];
    tags: Tag[];
    products: Product[];
    productFacets: ProductFacets;
    cartItems: CartItem[];
    defaultAddress: ShippingAddress;
    defaultAddressCountry: string;
    deliveryDates: AvailableDeliveryDate[];
    deliverySelection: DeliverySelection;
    createdOrder: OrderDetails | null;
    checkoutSession: CheckoutSessionDetails | null;
    settingsOrdersResponse: SettingsOrdersListResponse;
}

export interface ApiScenarioOptions {
    authState?: ApiScenario["authState"];
    loginMode?: ApiScenario["loginMode"];
    refreshSessionFails?: boolean;
    paymentSessionFails?: boolean;
    missingDefaultAddress?: boolean;
    notificationsUpdateFails?: boolean;
}

export interface CheckoutOptions {
    couponCode?: string | null;
    tipAmount?: number;
    orderStatus?: OrderStatusType;
}
