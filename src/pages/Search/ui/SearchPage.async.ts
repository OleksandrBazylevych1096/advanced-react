import {lazy} from "react";

export const SearchPageAsync = lazy(
    () =>
        new Promise((resolve) => {
            //@ts-expect-error Simulate delay
            setTimeout(() => resolve(import("./SearchPage")), 1500);
        }),
);
