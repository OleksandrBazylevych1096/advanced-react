import type {SerializedError} from "@reduxjs/toolkit";
import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";

interface ApiErrorData {
    code: string;
    message?: string;
}

interface NestApiErrorEnvelope {
    message?: ApiErrorData | string;
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === "object" && error !== null && "status" in error;
};

const isApiErrorData = (value: unknown): value is ApiErrorData => {
    return (
        typeof value === "object" &&
        value !== null &&
        "code" in value &&
        typeof (value as {code?: unknown}).code === "string"
    );
};

const isNestApiErrorEnvelope = (value: unknown): value is NestApiErrorEnvelope => {
    return typeof value === "object" && value !== null;
};

export const extractApiErrorCode = (error: FetchBaseQueryError | SerializedError | unknown) => {
    if (!isFetchBaseQueryError(error) || !("data" in error)) {
        return undefined;
    }

    const responseData = error.data;
    if (isApiErrorData(responseData)) {
        return responseData.code;
    }

    if (isNestApiErrorEnvelope(responseData) && isApiErrorData(responseData.message)) {
        return responseData.message.code;
    }

    return undefined;
};
