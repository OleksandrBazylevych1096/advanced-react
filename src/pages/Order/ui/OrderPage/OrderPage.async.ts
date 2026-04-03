import {lazy} from "react";

export const OrderPageAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("./OrderPage")), 1500);
        }),
);
