import type { Decorator } from "@storybook/react-vite";
import { BrowserRouter } from "react-router";

export const RouterDecorator: Decorator = (Story, context) => {
  return (
    <BrowserRouter>
      <Story {...context} />
    </BrowserRouter>
  );
};
