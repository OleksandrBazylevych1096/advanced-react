import type { Decorator } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

export const RouterDecorator: Decorator = (Story, context) => {
  const parameters = context.parameters as { route?: string };

  const route = parameters.route || "/";

  return (
    <MemoryRouter initialEntries={[route]}>
      <Story {...context} />
    </MemoryRouter>
  );
};
