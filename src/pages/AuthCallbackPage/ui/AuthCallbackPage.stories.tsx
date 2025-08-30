import type { Meta, StoryObj } from "@storybook/react-vite";

import AuthCallbackPage from "./AuthCallbackPage";

const meta = {
  title: "pages/AuthCallbackPage",
  component: AuthCallbackPage,
  parameters: { route: "/oauth?code=demo" },
} satisfies Meta<typeof AuthCallbackPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  parameters: {
    initialState: {
      authByGoogle: { isLoading: true },
    },
  },
};

export const QueryError: Story = {
  parameters: {
    route: "/oauth?error=GOOGLE_AUTH_FAILED",
  },
};

export const StateError: Story = {
  parameters: {
    initialState: {
      authByGoogle: { isLoading: false, error: "error" },
    },
  },
};
