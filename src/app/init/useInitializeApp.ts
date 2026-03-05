import {useInitializeCart} from "./cart/useInitializeCart.ts";
import {useInitializeCurrency} from "./currency/useInitializeCurrency.ts";
import {useInitializeUserSession} from "./user/useInitializeUserSession.ts";

export const useInitializeApp = () => {
    useInitializeUserSession();
    useInitializeCurrency();
    useInitializeCart();
};
