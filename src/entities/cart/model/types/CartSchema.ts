import type {Product} from "@/entities/product/@x/cart";

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartTotals {
    subtotal: number;
    totalItems: number;
    estimatedShipping: number;
    estimatedTax: number;
    total: number;
}

export interface Cart {
    items: CartItem[];
    totals: CartTotals;
}

export interface CartValidationItem {
    cartItemId: string;
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
    isValid: boolean;
    issues: string[];
}

export interface GuestCartItem {
    productId: string;
    quantity: number;
    product: Product;
    addedAt: number;
}

export interface CartSchema {
    guestItems: GuestCartItem[];
    isInitialized: boolean;
}
