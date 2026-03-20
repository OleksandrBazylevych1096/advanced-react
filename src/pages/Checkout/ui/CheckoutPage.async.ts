import {lazy} from "react";

export const CheckoutPageAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("./CheckoutPage")), 1500);
        }),
);
