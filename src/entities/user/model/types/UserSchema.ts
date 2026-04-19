import type {AuthProvidersType, CurrencyType} from "@/shared/config";

import type {MfaMethod} from "./MfaMethod.ts";

export interface User {
    id: string;
    email?: string;
    phone?: string;
    roles?: string[];
    provider: AuthProvidersType;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    emailNotificationsEnabled?: boolean;
    isTwoFactorEnabled?: boolean;
}

export interface UserSchema {
    userData?: User;
    currency: CurrencyType;
    accessToken?: string;
    accessTokenExpiresAt?: string;
    isSessionReady: boolean;
    pendingMfaChallenge?: {
        mfaToken: string;
        mfaTokenExpiresAt?: string;
        availableMethods?: MfaMethod[];
    };
}
