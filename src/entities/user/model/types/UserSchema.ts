import type { AuthProvidersType } from "@/shared/config";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  isVerified?: boolean;
  provider: AuthProvidersType;
}

export interface UserSchema {
  userData?: User;
}
