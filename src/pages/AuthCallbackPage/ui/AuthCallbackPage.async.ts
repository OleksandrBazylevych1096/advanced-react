import { lazy } from "react";

export const AuthCallbackPageAsync = lazy(
  () =>
    new Promise((resolve) => {
      //@ts-expect-error Simulate delay
      setTimeout(() => resolve(import("./AuthCallbackPage")), 1500);
    })
);
