import { lazy } from "react";

export const LoginPageAsync = lazy(
  () =>
    new Promise((resolve) => {
      //@ts-expect-error Simulate delay
      setTimeout(() => resolve(import("./LoginPage")), 1500);
    })
);
