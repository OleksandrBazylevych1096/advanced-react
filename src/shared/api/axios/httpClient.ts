import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import axios from "axios";

import { API_URL, LOCAL_STORAGE_USER_KEY } from "@/shared/config";

interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type QueueCallback = (success: boolean, error?: AxiosError) => void;

interface RefreshError extends Error {
  isRefreshError: true;
  originalError: AxiosError;
}

export const httpClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
const refreshQueue: QueueCallback[] = [];

const REFRESH_TIMEOUT = 15000;

const subscribeRefresh = (cb: QueueCallback) => {
  refreshQueue.push(cb);
};

const flushQueue = (error: AxiosError | null, success: boolean) => {
  while (refreshQueue.length) {
    const cb = refreshQueue.shift();
    if (cb) {
      cb(success, error || undefined);
    }
  }
};

const createRefreshError = (originalError: AxiosError): RefreshError => {
  const refreshError = new Error("Token refresh failed") as RefreshError;
  refreshError.isRefreshError = true;
  refreshError.originalError = originalError;
  return refreshError;
};

const isNetworkError = (error: AxiosError) => {
  return (
    !error.response &&
    (error.code === "ECONNABORTED" ||
      error.code === "ENOTFOUND" ||
      error.code === "ECONNRESET" ||
      error.message.includes("timeout"))
  );
};

const logError = (context: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.log(`HTTP CLIENT ${context}:`, error);
  }
};

httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error?.response?.status;
    const originalConfig = error?.config as
      | ExtendedAxiosRequestConfig
      | undefined;

    logError("response interceptor", {
      status,
      url: originalConfig?.url,
      method: originalConfig?.method,
      message: error.message,
    });

    if (!originalConfig) {
      return Promise.reject(error);
    }

    if (status !== 401 || originalConfig?._retry) {
      return Promise.reject(error);
    }

    if (originalConfig?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await httpClient.post(
          "/auth/refresh",
          {},
          {
            timeout: REFRESH_TIMEOUT,
            transformRequest: [(data) => data],
          }
        );
        logError("success refresh", {
          status: refreshResponse.status,
        });

        isRefreshing = false;
        flushQueue(null, true);

        return httpClient(originalConfig);
      } catch (refreshError) {
        isRefreshing = false;
        const AxiosRefreshError = refreshError as AxiosError;

        logError("refresh failed", {
          status: AxiosRefreshError?.response?.status,
          message: AxiosRefreshError.message,
          isNetworkError: isNetworkError(AxiosRefreshError),
        });

        try {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        } catch (storageError) {
          logError("storage clear erro", storageError);
        }

        if (authFailureHandler) {
          try {
            authFailureHandler(AxiosRefreshError);
          } catch (handlerError) {
            logError("auth failure handler error", handlerError);
          }
        }

        flushQueue(AxiosRefreshError, false);

        return Promise.reject(createRefreshError(AxiosRefreshError));
      }
    }

    return new Promise<AxiosResponse>((resolve, reject) => {
      subscribeRefresh((success: boolean, refreshError?: AxiosError) => {
        if (success) {
          httpClient(originalConfig).then(resolve).catch(reject);
        } else {
          const finalError = refreshError
            ? createRefreshError(refreshError)
            : error;
          reject(finalError);
        }
      });
    });
  }
);

type AuthFailureHandler = (error?: AxiosError) => void;

let authFailureHandler: AuthFailureHandler | null = null;

export const setAuthFailureHandler = (handler: AuthFailureHandler) => {
  authFailureHandler = handler;
};

export const isRefreshError = (error: unknown): error is RefreshError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isRefreshError" in error &&
    error.isRefreshError === true
  );
};
