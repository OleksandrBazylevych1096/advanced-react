import { beforeEach, describe, expect, test, vi } from "vitest";

import { applyUserSession } from "@/entities/user";

import { extractErrorMessage, httpClient } from "@/shared/api";
import { testAsyncThunk } from "@/shared/lib/test/testAsyncThunk";

import { login } from "./login";

vi.mock("@/entities/User", () => ({
  applyUserSession: vi.fn(),
}));

vi.mock("@/shared/api", () => ({
  httpClient: { post: vi.fn() },
  extractErrorMessage: vi.fn((error) => error.message || "unknown error"),
}));

const mockedApplyUserSession = vi.mocked(applyUserSession, true);
const mockedHttpClient = vi.mocked(httpClient, true);
const mockedExtractErrorMessage = vi.mocked(extractErrorMessage, true);

describe("login thunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("success login with email", async () => {
    const testData = { email: "test@test.com", password: "123456" };
    const fakeUser = {
      id: "1",
      email: testData.email,
      provider: "LOCAL",
      isVerified: true,
    };

    mockedHttpClient.post.mockResolvedValueOnce({ data: fakeUser });

    const { result, dispatch } = await testAsyncThunk(login, testData);

    expect(mockedHttpClient.post).toHaveBeenCalledWith("/auth/login", testData);
    expect(mockedApplyUserSession).toHaveBeenCalledWith(fakeUser, dispatch);
    expect(result.meta.requestStatus).toBe("fulfilled");
  });
  test("success login with phone", async () => {
    const testData = { phone: "84932474287", password: "123456" };
    const fakeUser = {
      id: "1",
      phone: testData.phone,
      provider: "LOCAL",
      isVerified: true,
    };

    mockedHttpClient.post.mockResolvedValueOnce({ data: fakeUser });

    const { result, dispatch } = await testAsyncThunk(login, testData);

    expect(mockedHttpClient.post).toHaveBeenCalledWith("/auth/login", testData);
    expect(mockedApplyUserSession).toHaveBeenCalledWith(fakeUser, dispatch);
    expect(result.meta.requestStatus).toBe("fulfilled");
  });
  test("login failure returns rejectWithValue", async () => {
    const testData = { phone: "84932474287", password: "123456" };
    const errorMessage = "Invalid credentials";
    mockedHttpClient.post.mockRejectedValueOnce(new Error(errorMessage));
    mockedExtractErrorMessage.mockReturnValueOnce(errorMessage);

    const { result } = await testAsyncThunk(login, testData);

    expect(mockedApplyUserSession).not.toHaveBeenCalled();
    expect(result.payload).toBe(errorMessage);
    expect(result.meta.requestStatus).toBe("rejected");
  });
});
