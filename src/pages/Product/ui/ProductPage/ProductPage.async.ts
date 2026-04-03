import {lazy} from "react";

export const ProductPageAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("././ProductPage")), 1500);
        }),
);
