import {generateUuid} from "@/shared/lib/browser";

import type {GuestCartItem} from "../model/types/CartSchema";

const CART_STORAGE_KEY = "guest_cart_v1";
const CART_EXPIRY_DAYS = 30;
const DEVICE_ID_KEY = "device_id";

interface StoredCart {
    items: GuestCartItem[];
    updatedAt: number;
    deviceId: string;
    version: 1;
}

function getDeviceId(): string {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        deviceId = generateUuid();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
}

function isExpired(updatedAt: number): boolean {
    const expiryMs = CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return Date.now() - updatedAt > expiryMs;
}

export function getGuestCart(): GuestCartItem[] {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];

        const stored: StoredCart = JSON.parse(raw);

        if (stored.version !== 1) {
            clearGuestCart();
            return [];
        }

        if (isExpired(stored.updatedAt)) {
            clearGuestCart();
            return [];
        }

        return stored.items;
    } catch {
        clearGuestCart();
        return [];
    }
}

export function setGuestCart(items: GuestCartItem[]): void {
    try {
        const stored: StoredCart = {
            items,
            updatedAt: Date.now(),
            deviceId: getDeviceId(),
            version: 1,
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    } catch (e) {
        console.error("Failed to save guest cart:", e);
    }
}

export function clearGuestCart(): void {
    try {
        localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
        // silent
    }
}

export {CART_STORAGE_KEY};
