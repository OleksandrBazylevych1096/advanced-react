import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthMethod } from "@/shared/config";

import { loginReducer } from "../../model/slice/loginSlice";

import { LoginForm } from "./LoginForm";

const meta = {
  title: "features/LoginForm",
  component: LoginForm,
  parameters: {
    asyncReducers: {
      loginForm: loginReducer,
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmailDefault: Story = {
  parameters: {
    initialState: {
      loginForm: {
        email: "",
        phone: "",
        password: "",
        isLoading: false,
        method: AuthMethod.EMAIL,
      },
    },
  },
};

export const EmailFilled: Story = {
  parameters: {
    initialState: {
      loginForm: {
        email: "test@test.com",
        phone: "",
        password: "123456",
        isLoading: false,
        method: AuthMethod.EMAIL,
      },
    },
  },
};
export const PhoneDefault: Story = {
  parameters: {
    initialState: {
      loginForm: {
        email: "",
        phone: "",
        password: "",
        isLoading: false,
        method: AuthMethod.PHONE,
      },
    },
  },
};

export const PhoneFilled: Story = {
  parameters: {
    initialState: {
      loginForm: {
        email: "",
        phone: "+380573894578",
        password: "123456",
        isLoading: false,
        method: AuthMethod.PHONE,
      },
    },
  },
};
export const Loading: Story = {
  parameters: {
    initialState: {
      loginForm: {
        email: "test@test.com",
        phone: "",
        password: "123456",
        isLoading: true,
        method: AuthMethod.EMAIL,
      },
    },
  },
};

export const Error: Story = {
  parameters: {
    initialState: {
      loginForm: {
        email: "test@test.com",
        phone: "",
        password: "123456",
        isLoading: false,
        method: AuthMethod.EMAIL,
        error: "error",
      },
    },
  },
};
