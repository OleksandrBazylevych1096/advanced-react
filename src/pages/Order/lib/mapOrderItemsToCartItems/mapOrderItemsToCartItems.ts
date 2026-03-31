import type {CartItem} from "@/entities/cart";
import type {OrderDetailsItem} from "@/entities/order";

export const mapOrderItemsToCartItems = (
    orderItems: OrderDetailsItem[] | undefined,
): CartItem[] => {
    if (!orderItems) return [];

    return orderItems.map((item) => {
        return {
            id: item.id,
            quantity: item.quantity,
            product: item.product,
        };
    });
};
