import type {MfaMethod} from "./MfaMethod.ts";
import type {User} from "./UserSchema";

export interface AuthSessionResponse {
    user: User;
    accessToken: string;
    accessTokenExpiresAt: string;
    sessionId?: string;
    refreshTokenExpiresAt?: string;
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
