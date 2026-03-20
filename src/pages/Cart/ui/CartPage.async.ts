import {lazy} from "react";

export const CartPageAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("./CartPage")), 1500);
        }),
);
