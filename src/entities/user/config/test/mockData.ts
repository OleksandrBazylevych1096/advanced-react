import type {
    AuthSessionResponse,
    AuthSessionsListItem,
    MfaChallengeResponse,
} from "../../model/types/AuthSession";

export const mockUser = {
    id: "u1",
    email: "user@example.com",
    provider: "LOCAL",
    isEmailVerified: true,
    isTwoFactorEnabled: false,
} as const;

export const mockAuthSession: AuthSessionResponse = {
    user: mockUser,
    accessToken: "access-token-1",
    accessTokenExpiresAt: "2030-01-01T00:00:00.000Z",
    sessionId: "session-current",
};

export const mockMfaChallenge: MfaChallengeResponse = {
    requiresTwoFactor: true,
    mfaToken: "mfa-token-1",
    mfaTokenExpiresAt: "2030-01-01T00:00:00.000Z",
    availableMethods: ["totp", "backup_code", "otp_email"],
};

export const mockAuthSessions: AuthSessionsListItem[] = [
    {
        id: "session-current",
        userId: "u1",
        ip: "127.0.0.1",
        userAgent: "Chrome on Windows",
        isActive: true,
        createdAt: "2026-03-01T10:00:00.000Z",
        updatedAt: "2026-03-20T10:00:00.000Z",
        lastActivity: "2026-03-20T10:00:00.000Z",
        isCurrent: true,
    },
    {
        id: "session-2",
        userId: "u1",
        ip: "10.10.0.2",
        userAgent: "Safari on iPhone",
        isActive: true,
        createdAt: "2026-03-19T10:00:00.000Z",
        updatedAt: "2026-03-20T09:00:00.000Z",
        lastActivity: "2026-03-20T09:00:00.000Z",
        isCurrent: false,
    },
];

export const mockSetupTwoFactor = {
    qrCodeDataUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB",
    backupCodes: ["ABCD-1234", "EFGH-5678", "IJKL-9012"],
};
