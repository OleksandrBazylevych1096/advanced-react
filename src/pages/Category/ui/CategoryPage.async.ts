import {lazy} from "react";

export const CategoryPageAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("./CategoryPage")), 1500);
        })
);
