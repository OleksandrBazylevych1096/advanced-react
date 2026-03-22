import type {SerializedError} from "@reduxjs/toolkit";
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

import {i18n} from "@/shared/config/i18n";

import {extractApiErrorCode} from "../extractApiErrorCode/extractApiErrorCode";

interface ApiErrorData {
    code: string;
    message?: string;
    details?: unknown;
}

interface NestApiErrorEnvelope {
    message?: ApiErrorData | string;
    error?: string;
    statusCode?: number;
}

const isApiErrorData = (value: unknown): value is ApiErrorData => {
    return (
        typeof value === "object" &&
        value !== null &&
        "code" in value &&
        typeof value.code === "string"
    );
};

const isNestApiErrorEnvelope = (value: unknown): value is NestApiErrorEnvelope => {
    return typeof value === "object" && value !== null;
};

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === "object" && error !== null && "status" in error;
};

const extractTranslatedCodeMessage = (code: string) => {
    const translationKeys = [`errors.${code}`, `auth:errors.${code}`];

    for (const key of translationKeys) {
        const translated = i18n.t(key);
        if (translated !== key) {
            return translated;
        }
    }

    return undefined;
};

export const extractApiErrorMessage = (error: FetchBaseQueryError | SerializedError | unknown) => {
    const errorCode = extractApiErrorCode(error);
    if (errorCode) {
        const translated = extractTranslatedCodeMessage(errorCode);
        if (translated) {
            return translated;
        }
    }

    if (isFetchBaseQueryError(error)) {
        if ("error" in error) {
            return error.error;
        }

        if ("data" in error) {
            const responseData = error.data;
            if (isApiErrorData(responseData)) {
                return (
                    extractTranslatedCodeMessage(responseData.code) ??
                    responseData.message ??
                    i18n.t("errors.unknownError")
                );
            }

            if (isNestApiErrorEnvelope(responseData)) {
                if (isApiErrorData(responseData.message)) {
                    return (
                        extractTranslatedCodeMessage(responseData.message.code) ??
                        responseData.message.message ??
                        i18n.t("errors.unknownError")
                    );
                }

                if (typeof responseData.message === "string" && responseData.message) {
                    return responseData.message;
                }

                if (typeof responseData.error === "string" && responseData.error) {
                    return responseData.error;
                }
            }
        }
    }

    if (typeof error === "object" && error !== null && "message" in error) {
        const message = (error as {message?: unknown}).message;
        if (typeof message === "string" && message) {
            return message;
        }
    }

    return i18n.t("errors.unknownError");
};
