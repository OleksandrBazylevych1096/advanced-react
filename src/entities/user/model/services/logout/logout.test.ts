import { beforeEach, describe, expect, test, vi } from "vitest";

import { httpClient } from "@/shared/api";
import { LOCAL_STORAGE_USER_KEY } from "@/shared/config";
import { testAsyncThunk } from "@/shared/lib/test/testAsyncThunk";

import { userActions } from "../../slice/userSlice";

import { logout } from "./logout";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

vi.mock("../../slice/userSlice", () => ({
  userActions: {
    clearUserData: vi.fn(),
  },
}));

vi.mock("@/shared/api", () => ({
  httpClient: { post: vi.fn() },
}));

const mockedHttpClient = vi.mocked(httpClient, true);
const mockedUserActions = vi.mocked(userActions, true);

const mockAction = {
  type: "user/clearUserData" as const,
  payload: undefined,
};

describe("logout thunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.removeItem.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  test("success logout clears user data and localStorage", async () => {
    mockedHttpClient.post.mockResolvedValueOnce({});
    mockedUserActions.clearUserData.mockReturnValue(mockAction);

    const { result, dispatch } = await testAsyncThunk(logout, undefined);

    expect(mockedHttpClient.post).toHaveBeenCalledWith("/auth/logout");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_USER_KEY
    );
    expect(mockedUserActions.clearUserData).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(mockAction);
    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  test("logout with API error still clears local data", async () => {
    mockedHttpClient.post.mockRejectedValueOnce(new Error("Server error"));
    mockedUserActions.clearUserData.mockReturnValue(mockAction);

    const { result, dispatch } = await testAsyncThunk(logout, undefined);

    expect(mockedHttpClient.post).toHaveBeenCalledWith("/auth/logout");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_USER_KEY
    );
    expect(mockedUserActions.clearUserData).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(mockAction);
    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  test("logout with network error still clears local data", async () => {
    mockedHttpClient.post.mockRejectedValueOnce(new Error("Network Error"));
    mockedUserActions.clearUserData.mockReturnValue(mockAction);

    const { result, dispatch } = await testAsyncThunk(logout, undefined);

    expect(mockedHttpClient.post).toHaveBeenCalledWith("/auth/logout");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_USER_KEY
    );
    expect(mockedUserActions.clearUserData).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(mockAction);
    expect(result.meta.requestStatus).toBe("fulfilled");
  });

  test("logout executes successfully even with API failure", async () => {
    mockedHttpClient.post.mockRejectedValueOnce(new Error("API unavailable"));
    mockedUserActions.clearUserData.mockReturnValue(mockAction);

    const { result, dispatch } = await testAsyncThunk(logout, undefined);

    expect(mockedHttpClient.post).toHaveBeenCalledWith("/auth/logout");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_USER_KEY
    );
    expect(mockedUserActions.clearUserData).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(mockAction);
    expect(result.meta.requestStatus).toBe("fulfilled");
    expect(result.payload).toBeUndefined();
  });

  test("LOCAL_STORAGE_USER_KEY has expected value", () => {
    expect(LOCAL_STORAGE_USER_KEY).toBeDefined();
  });
});
