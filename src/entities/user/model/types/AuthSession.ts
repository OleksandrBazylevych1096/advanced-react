import type {User} from "./UserSchema";

export type MfaMethod = "totp" | "otp_email" | "otp_sms" | "backup_code";

export interface AuthSessionResponse {
    user: User;
    accessToken: string;
    accessTokenExpiresAt: string;
    sessionId?: string;
}

export interface MfaChallengeResponse {
    requiresTwoFactor: true;
    mfaToken: string;
    mfaTokenExpiresAt: string;
    availableMethods?: MfaMethod[];
}

export interface PendingMfaChallenge {
    mfaToken: string;
    mfaTokenExpiresAt?: string;
    availableMethods?: MfaMethod[];
}

export interface AuthSessionsListItem {
    id: string;
    userId: string;
    ip?: string;
    userAgent?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastActivity?: string;
    revokedAt?: string | null;
    revokedReason?: string | null;
    isCurrent?: boolean;
}

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
