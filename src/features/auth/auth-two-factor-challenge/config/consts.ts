import type {MfaMethod} from "@/entities/user";

export const methodKeyMap: Record<MfaMethod, string> = {
    totp: "twoFactor.methods.totp",
    otp_email: "twoFactor.methods.otp_email",
    otp_sms: "twoFactor.methods.otp_sms",
    backup_code: "twoFactor.methods.backup_code",
} as const;

export const otpLengthMap: Record<MfaMethod, number> = {
    totp: 6,
    otp_email: 4,
    otp_sms: 4,
    backup_code: 0,
};

export const DEFAULT_METHODS: MfaMethod[] = ["totp", "otp_email", "otp_sms", "backup_code"];
