import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { StateSchema } from "@/app/store";

import { AuthMethod } from "@/shared/config";
import { type DeepPartial } from "@/shared/lib";
import { renderWithProviders } from "@/shared/lib/test/renderWithProviders";

import { login } from "../../model/services/login/login";
import { loginActions, loginReducer } from "../../model/slice/loginSlice";

import { LoginForm } from "./LoginForm";

vi.mock("../../model/services/login/login");
const mockedLogin = vi.mocked(login, true);

describe("loginForm", () => {
  const mockInitialState: DeepPartial<StateSchema> = {
    loginForm: {
      email: "",
      phone: "",
      password: "",
      method: AuthMethod.EMAIL,
      isLoading: false,
      error: undefined,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line
    mockedLogin.mockReturnValue({ type: "features/login" } as any);
  });

  test("should show email tab content by default", () => {
    renderWithProviders(<LoginForm />, {
      initialState: mockInitialState as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    expect(screen.getByTestId("email-content")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });
  test("should switch to phone tab", async () => {
    const user = userEvent.setup();

    const mockSetMethod = vi.fn(() => ({
      type: "loginForm/setMethod" as const,
      payload: AuthMethod.PHONE,
    }));

    const mockResetForm = vi.fn(() => ({
      type: "loginForm/resetForm" as const,
      payload: undefined,
    }));

    vi.spyOn(loginActions, "setMethod").mockImplementation(mockSetMethod);
    vi.spyOn(loginActions, "resetForm").mockImplementation(mockResetForm);

    renderWithProviders(<LoginForm />, {
      initialState: mockInitialState as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    await user.click(screen.getByTestId("phone-tab"));

    expect(mockSetMethod).toHaveBeenCalledWith(AuthMethod.PHONE);
    expect(mockResetForm).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("phone-content")).toBeInTheDocument();
  });
  test("should switch from phone tab to email tab", async () => {
    const user = userEvent.setup();

    const stateWithPhoneMethod: DeepPartial<StateSchema> = {
      loginForm: {
        ...mockInitialState,
        method: AuthMethod.PHONE,
      },
    };

    renderWithProviders(<LoginForm />, {
      initialState: stateWithPhoneMethod as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    await user.click(screen.getByTestId("email-tab"));

    expect(screen.getByTestId("email-content")).toBeInTheDocument();
  });
  test("should update inputs", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />, {
      initialState: mockInitialState as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    const testEmail = "test@email.com";
    const testPassword = "123456";

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await user.type(emailInput, testEmail);
    await user.type(passwordInput, testPassword);

    expect(emailInput).toHaveValue(testEmail);
    expect(passwordInput).toHaveValue(testPassword);
  });
  test("should dispatch login on submit", async () => {
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />, {
      initialState: mockInitialState as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    await user.click(screen.getByTestId("submit-button"));

    expect(login).toHaveBeenCalledWith({
      email: "",
      phone: "",
      password: "",
    });
  });
  test("should show loading state on submit button", () => {
    const stateWithLoading: DeepPartial<StateSchema> = {
      loginForm: {
        ...mockInitialState,
        isLoading: true,
      },
    };

    renderWithProviders(<LoginForm />, {
      initialState: stateWithLoading as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    expect(screen.getByTestId("submit-button")).toHaveClass(/isLoading/);
  });
  test("should show error message", () => {
    const errorMessage = "error";
    const stateWithError: DeepPartial<StateSchema> = {
      loginForm: {
        ...mockInitialState,
        error: errorMessage,
      },
    };

    renderWithProviders(<LoginForm />, {
      initialState: stateWithError as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
  });
  test("should not display error message without error", () => {
    renderWithProviders(<LoginForm />, {
      initialState: mockInitialState as StateSchema,
      asyncReducers: { loginForm: loginReducer },
    });

    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });
});
