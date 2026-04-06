import type {MfaChallengeResponse} from "../model/types/AuthSession";

export const isMfaChallengeResponse = (value: unknown): value is MfaChallengeResponse => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const record = value as Record<string, unknown>;
    return (
        record.requiresTwoFactor === true &&
        typeof record.mfaToken === "string" &&
        typeof record.mfaTokenExpiresAt === "string"
    );
};
