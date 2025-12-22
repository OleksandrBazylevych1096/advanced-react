import { lazy } from "react";

export const EditAddressAsync = lazy(
  () =>
    new Promise((resolve) => {
      //@ts-expect-error Simulating a dynamic import with a delay for demonstration purposes
      setTimeout(() => resolve(import("../EditAddress/EditAddress")), 1000);
    })
);
