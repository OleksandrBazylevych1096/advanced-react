import {http, HttpResponse} from "msw";

import {API_URL} from "@/shared/config";
import {createHandlers, extendHandlers} from "@/shared/lib/testing";

import {mockAuthSession, mockAuthSessions, mockMfaChallenge, mockSetupTwoFactor} from "./mockData";

const loginBase = createHandlers({
    endpoint: `${API_URL}/auth/login`,
    method: "post",
    defaultData: mockAuthSession,
    errorData: {error: "Invalid credentials"},
    errorStatus: 401,
});

const forgotPasswordBase = createHandlers({
    endpoint: `${API_URL}/auth/forgot-password`,
    method: "post",
    defaultData: {success: true},
    errorData: {error: "Failed to request password reset"},
    errorStatus: 500,
});

const resetPasswordBase = createHandlers({
    endpoint: `${API_URL}/auth/reset-password`,
    method: "post",
    defaultData: {success: true},
    errorData: {error: "Reset link is invalid or expired"},
    errorStatus: 400,
});

const sessionsBase = createHandlers({
    endpoint: `${API_URL}/auth/sessions`,
    method: "get",
    defaultData: mockAuthSessions,
    errorData: {error: "Failed to load sessions"},
    errorStatus: 500,
});

const revokeSessionBase = createHandlers({
    endpoint: `${API_URL}/auth/sessions/:sessionId`,
    method: "delete",
    defaultData: {success: true},
    errorData: {error: "Failed to revoke session"},
    errorStatus: 500,
});

const revokeAllSessionsBase = createHandlers({
    endpoint: `${API_URL}/auth/sessions`,
    method: "delete",
    defaultData: {success: true},
    errorData: {error: "Failed to revoke sessions"},
    errorStatus: 500,
});

const setupTwoFactorBase = createHandlers({
    endpoint: `${API_URL}/auth/2fa/setup`,
    method: "post",
    defaultData: mockSetupTwoFactor,
    errorData: {error: "Failed to setup two-factor"},
    errorStatus: 500,
});

const enableTwoFactorBase = createHandlers({
    endpoint: `${API_URL}/auth/2fa/enable`,
    method: "post",
    defaultData: {success: true},
    errorData: {error: "Invalid verification code"},
    errorStatus: 400,
});

const verifyTwoFactorBase = createHandlers({
    endpoint: `${API_URL}/auth/2fa/verify`,
    method: "post",
    defaultData: mockAuthSession,
    errorData: {error: "Invalid code"},
    errorStatus: 400,
});

const sendOtpBase = createHandlers({
    endpoint: `${API_URL}/auth/otp/send`,
    method: "post",
    defaultData: {success: true},
    errorData: {error: "Failed to send code"},
    errorStatus: 500,
});

const verifyOtpBase = createHandlers({
    endpoint: `${API_URL}/auth/otp/verify`,
    method: "post",
    defaultData: mockAuthSession,
    errorData: {error: "Invalid code"},
    errorStatus: 400,
});

const unlinkGoogleBase = createHandlers({
    endpoint: `${API_URL}/auth/google/link`,
    method: "delete",
    defaultData: {success: true},
    errorData: {error: "Failed to unlink Google account"},
    errorStatus: 500,
});

export const userAuthHandlers = {
    login: extendHandlers(loginBase, {
        mfaRequired: http.post(`${API_URL}/auth/login`, () => HttpResponse.json(mockMfaChallenge)),
    }),
    forgotPassword: forgotPasswordBase,
    resetPassword: resetPasswordBase,
    sessions: extendHandlers(sessionsBase, {
        empty: http.get(`${API_URL}/auth/sessions`, () => HttpResponse.json([])),
    }),
    revokeSession: revokeSessionBase,
    revokeAllSessions: revokeAllSessionsBase,
    setupTwoFactor: setupTwoFactorBase,
    enableTwoFactor: enableTwoFactorBase,
    verifyTwoFactor: verifyTwoFactorBase,
    sendOtp: sendOtpBase,
    verifyOtp: verifyOtpBase,
    unlinkGoogle: unlinkGoogleBase,
};
