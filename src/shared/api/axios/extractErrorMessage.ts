import type { AxiosError } from "axios";

import i18n from "@/shared/config/i18n/i18n";

interface ApiErrorData {
  code: string;
  message?: string;
  details?: unknown;
}

const isAxiosError = (error: unknown): error is AxiosError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    error.isAxiosError === true
  );
};

const isApiErrorData = (data: unknown): data is ApiErrorData => {
  return (
    typeof data === "object" &&
    data !== null &&
    "code" in data &&
    typeof data.code === "string"
  );
};

const extractErrorCode = (error: unknown) => {
  if (!isAxiosError(error)) return undefined;

  const responseData = error.response?.data;
  if (isApiErrorData(responseData)) return responseData.code;

  return undefined;
};

export const extractErrorMessage = (error: unknown) => {
  const code = extractErrorCode(error);

  if (code) {
    const translated = i18n.t(`errors.${code}`);
    if (translated && translated !== `errors.${code}`) {
      return translated;
    }
  }

  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    if (isApiErrorData(responseData) && responseData.message) {
      return responseData.message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return i18n.t("errors.unknownError");
};
