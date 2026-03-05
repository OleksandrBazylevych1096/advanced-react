import type {Cart} from "../model/types/CartSchema";

export const recalculateCartTotals = (cart: Cart) => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totals.subtotal = subtotal;
    cart.totals.totalItems = totalItems;
    cart.totals.total = subtotal + cart.totals.estimatedShipping + cart.totals.estimatedTax;
};
