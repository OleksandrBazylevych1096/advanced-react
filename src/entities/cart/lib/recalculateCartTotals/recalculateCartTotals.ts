import type {Cart} from "../../model/types/CartSchema";

export const recalculateCartTotals = (cart: Cart) => {
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const estimatedTax = subtotal * 0.1;
    const estimatedShipping = subtotal > 100 ? 0 : 10;

    cart.totals.subtotal = subtotal;
    cart.totals.totalItems = totalItems;
    cart.totals.estimatedTax = estimatedTax;
    cart.totals.estimatedShipping = estimatedShipping;
    cart.totals.total = subtotal + estimatedShipping + estimatedTax;
};
