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


