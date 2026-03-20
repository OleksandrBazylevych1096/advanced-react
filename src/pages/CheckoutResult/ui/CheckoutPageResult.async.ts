import {lazy} from "react";

export const CheckoutPageResultAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("./CheckoutResultPage")), 1500);
        }),
);
