import type {AuthProvidersType,CurrencyType} from "@/shared/config";

export interface User {
    id: string;
    email?: string;
    phone?: string;
    roles?: string[];
    provider: AuthProvidersType;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    isTwoFactorEnabled?: boolean;
}

export interface UserSchema {
    userData?: User;
    currency: CurrencyType;
    accessToken?: string;
    accessTokenExpiresAt?: string;
    pendingMfaChallenge?: {
        mfaToken: string;
        mfaTokenExpiresAt?: string;
        availableMethods?: import("./AuthSession").MfaMethod[];
    };
}
