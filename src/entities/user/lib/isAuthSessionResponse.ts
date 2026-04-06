import type {AuthSessionResponse} from "../model/types/AuthSession";

export const isAuthSessionResponse = (value: unknown): value is AuthSessionResponse => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const record = value as Record<string, unknown>;
    return (
        typeof record.accessToken === "string" &&
        typeof record.accessTokenExpiresAt === "string" &&
        typeof record.user === "object" &&
        record.user !== null
    );
};
