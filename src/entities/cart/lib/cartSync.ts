import type {GuestCartItem} from "../model/types/CartSchema";
import {generateUuid} from "@/shared/lib/browser";

import {CART_STORAGE_KEY} from "./cartStorage";

type CartSyncMessage =
    | {type: "CART_UPDATED"; items: GuestCartItem[]; tabId: string}
    | {type: "CART_CLEARED"; tabId: string};

const CHANNEL_NAME = "cart_sync";
const TAB_ID = generateUuid();

type CartSyncCallback = (items: GuestCartItem[]) => void;

let channel: BroadcastChannel | null = null;
let listeners: CartSyncCallback[] = [];

function getChannel(): BroadcastChannel | null {
    if (channel) return channel;

    if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel(CHANNEL_NAME);
        channel.onmessage = (event: MessageEvent<CartSyncMessage>) => {
            const msg = event.data;
            if (msg.tabId === TAB_ID) return;

            if (msg.type === "CART_UPDATED") {
                listeners.forEach((cb) => cb(msg.items));
            } else if (msg.type === "CART_CLEARED") {
                listeners.forEach((cb) => cb([]));
            }
        };
        return channel;
    }

    return null;
}

export function broadcastCartUpdate(items: GuestCartItem[]): void {
    const ch = getChannel();
    if (ch) {
        const message: CartSyncMessage = {
            type: "CART_UPDATED",
            items,
            tabId: TAB_ID,
        };
        ch.postMessage(message);
    }
}

export function broadcastCartClear(): void {
    const ch = getChannel();
    if (ch) {
        const message: CartSyncMessage = {
            type: "CART_CLEARED",
            tabId: TAB_ID,
        };
        ch.postMessage(message);
    }
}

export function onCartSync(callback: CartSyncCallback): () => void {
    const ch = getChannel();
    listeners.push(callback);

    if (ch) {
        return () => {
            listeners = listeners.filter((cb) => cb !== callback);
        };
    }

    const storageHandler = (event: StorageEvent) => {
        if (event.key === CART_STORAGE_KEY && event.newValue) {
            try {
                const stored = JSON.parse(event.newValue);
                if (stored.items) {
                    callback(stored.items);
                }
            } catch {
                // ignore
            }
        } else if (event.key === CART_STORAGE_KEY && !event.newValue) {
            callback([]);
        }
    };

    window.addEventListener("storage", storageHandler);

    return () => {
        listeners = listeners.filter((cb) => cb !== callback);
        window.removeEventListener("storage", storageHandler);
    };
}

export function destroyCartSync(): void {
    if (channel) {
        channel.close();
        channel = null;
    }
    listeners = [];
}

export {TAB_ID};
